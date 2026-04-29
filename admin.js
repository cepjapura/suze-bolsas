/* ==========================================================================
   SuzeAdmin Logic — Security-hardened Admin Panel
   ========================================================================== */

/* --------------------------------------------------------------------------
   Authentication — SHA-256 hashed password + rate limiting + lockout
   -------------------------------------------------------------------------- */
const _A = '_sz_auth';
const _L = '_sz_lk';
const _T = '_sz_att';
// SHA-256 hash of "SuzeAdmin@2026" — never store plaintext passwords
const _H = '56c759e8dd1b59c020a3777b3435fbb14a5816162398ea56aa047d79fd83ee43';
const _MAX = 3;
const _LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

async function _hash(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function _initAuth() {
    // Check lockout
    const lockUntil = sessionStorage.getItem(_L);
    if (lockUntil && Date.now() < parseInt(lockUntil)) {
        const remaining = Math.ceil((parseInt(lockUntil) - Date.now()) / 60000);
        alert(`Acesso bloqueado por tentativas inválidas. Aguarde ${remaining} minuto(s).`);
        window.location.replace('index.html');
        return false;
    }

    // Already authenticated this session
    if (sessionStorage.getItem(_A)) return true;

    // Prompt for password
    const pwd = prompt('Área Restrita. Digite a senha administrativa:');
    if (!pwd) {
        window.location.replace('index.html');
        return false;
    }

    const h = await _hash(pwd);
    if (h === _H) {
        sessionStorage.setItem(_A, btoa(Date.now().toString()));
        sessionStorage.removeItem(_T);
        return true;
    }

    // Wrong password — increment attempts
    const attempts = parseInt(sessionStorage.getItem(_T) || '0') + 1;
    sessionStorage.setItem(_T, String(attempts));
    if (attempts >= _MAX) {
        sessionStorage.setItem(_L, String(Date.now() + _LOCKOUT_MS));
        sessionStorage.removeItem(_T);
        alert('Muitas tentativas incorretas. Acesso bloqueado por 5 minutos.');
    } else {
        alert(`Senha incorreta. ${_MAX - attempts} tentativa(s) restante(s).`);
    }
    window.location.replace('index.html');
    return false;
}

// localStorage integrity helpers
const _SIG_KEY = '_sz_sig';
const _PROD_KEY = 'suze_products';
const _SECRET = 'sz2026';

async function _sign(data) {
    return (await _hash(_SECRET + JSON.stringify(data))).slice(0, 32);
}

async function _verifyAndLoad() {
    const raw = localStorage.getItem(_PROD_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        const storedSig = localStorage.getItem(_SIG_KEY);
        const computedSig = await _sign(parsed);
        if (storedSig !== computedSig) {
            console.warn('[Suze] Integridade dos dados comprometida — recarregando padrão.');
            localStorage.removeItem(_PROD_KEY);
            localStorage.removeItem(_SIG_KEY);
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

async function _saveWithSig(data) {
    const sig = await _sign(data);
    localStorage.setItem(_PROD_KEY, JSON.stringify(data));
    localStorage.setItem(_SIG_KEY, sig);
}

// --- Boot sequence ---
_initAuth().then(ok => {
    if (!ok) throw new Error('Unauthorized');
    _startAdmin();
}).catch(() => {});

/* ==========================================================================
   Admin Panel Logic
   ========================================================================== */
function _startAdmin() {
    document.addEventListener('DOMContentLoaded', () => {

        // Nav Logic
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        const views = document.querySelectorAll('.view-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                if (!targetId) return;
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                views.forEach(v => v.classList.remove('active'));
                document.getElementById(`view-${targetId}`).classList.add('active');
            });
        });

        // Forms Navigation
        const btnNewProduct = document.getElementById('btnNewProduct');
        const btnCancelProduct = document.getElementById('btnCancelProduct');
        const viewProducts = document.getElementById('view-products');
        const viewForm = document.getElementById('view-product-form');

        // ==========================================================================
        // Variations UI Logic
        // ==========================================================================
        const btnAddVariation = document.getElementById('btnAddVariation');
        const variationsContainer = document.getElementById('variationsContainer');

        function createVariationBlock(name = '', options = '') {
            const block = document.createElement('div');
            block.className = 'variation-block form-grid';
            block.style.cssText = 'background: var(--bg-main); padding: 1rem; border-radius: 8px; border: 1px solid var(--border); align-items: end;';
            block.innerHTML = `
                <div class="input-group">
                    <label>Nome da Variação</label>
                    <input type="text" class="var-name" placeholder="Ex: Tamanho" value="${_esc(name)}" required>
                </div>
                <div class="input-group" style="grid-column: span 2;">
                    <label>Opções (Separadas por vírgula)</label>
                    <input type="text" class="var-options" placeholder="Ex: P, M, G ou Rosa, Azul" value="${_esc(options)}" required>
                </div>
                <div class="input-group" style="width: max-content;">
                    <button type="button" class="btn btn-outline text-danger btn-remove-var" title="Remover" style="padding: 0.8rem; border-color: #ef4444; color: #ef4444;">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            `;
            block.querySelector('.btn-remove-var').addEventListener('click', () => block.remove());
            variationsContainer.appendChild(block);
        }

        // Simple HTML escaping to prevent XSS in admin inputs
        function _esc(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        btnAddVariation?.addEventListener('click', () => createVariationBlock());

        // ==========================================================================
        // Product Image Upload Logic
        // ==========================================================================
        let currentProductImages = [];

        function renderImagePreviews() {
            const container = document.getElementById('imagePreviewContainer');
            container.innerHTML = '';
            if (currentProductImages.length === 0) {
                container.innerHTML = '<p class="text-muted">Nenhuma imagem selecionada.</p>';
                return;
            }
            currentProductImages.forEach((imageSrc, index) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'position: relative; display: inline-block; margin-right: 10px; margin-bottom: 10px;';
                const img = document.createElement('img');
                img.src = imageSrc;
                img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border);';
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;';
                removeBtn.style.cssText = 'position:absolute;top:-5px;right:-5px;background:#dc3545;color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;';
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentProductImages.splice(index, 1);
                    renderImagePreviews();
                });
                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                container.appendChild(wrapper);
            });
        }

        const imageUploadInput = document.getElementById('pImageUpload');
        if (imageUploadInput) {
            imageUploadInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                const MAX_SIZE_MB = 2;
                files.forEach(file => {
                    if (!file.type.startsWith('image/')) {
                        alert(`Arquivo "${file.name}" não é uma imagem válida.`);
                        return;
                    }
                    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                        alert(`Imagem "${file.name}" é maior que ${MAX_SIZE_MB}MB. Reduza o tamanho antes de enviar.`);
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        currentProductImages.push(event.target.result);
                        renderImagePreviews();
                    };
                    reader.readAsDataURL(file);
                });
                imageUploadInput.value = '';
            });
        }

        btnNewProduct.addEventListener('click', () => {
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            document.getElementById('formTitle').textContent = 'Cadastrar Novo Produto';
            variationsContainer.innerHTML = '';
            currentProductImages = [];
            renderImagePreviews();
            views.forEach(v => v.classList.remove('active'));
            viewForm.classList.add('active');
        });

        btnCancelProduct.addEventListener('click', () => {
            views.forEach(v => v.classList.remove('active'));
            viewProducts.classList.add('active');
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-target="products"]').classList.add('active');
        });

        // ==========================================================================
        // Product Database (localStorage + integrity check)
        // ==========================================================================
        const defaultProducts = [
            {
                id: 1,
                name: "Capa para Caderneta de Vacina Linho Luxo / Porta Documentos",
                price: 149.90,
                installments: 3,
                images: [
                    "images/capa_vacinacao_heitor_luxo.jpg?v=1",
                    "images/capa_vacinacao_thomas.jpg?v=8",
                    "images/capa_vacinacao_vicente.jpg?v=8",
                    "images/capa_vacinacao_olivia.jpg?v=8",
                    "images/capa_vacinacao_benicio.jpg?v=8"
                ],
                rating: 124,
                stars: 5,
                weightKg: 0.3,
                badges: [{ text: "Mais Vendido", class: "badge-primary" }],
                description: "Capa para caderneta de vacinação luxo com porta documentos. Protege o histórico do seu bebê com estilo.",
                requiresCustomization: true,
                variations: [{ name: "Material", options: ["Linho Luxo"] }]
            },
            {
                id: 2,
                name: "Organizador Necessaire Transparente Bebe Mala Bege Maternidade",
                price: 110.00,
                installments: 3,
                images: [
                    "images/necessaire_transparente_1.jpg?v=1",
                    "images/necessaire_transparente_2.jpg?v=1",
                    "images/necessaire_transparente_3.jpg?v=1",
                    "images/necessaire_transparente_4.jpg?v=1"
                ],
                badges: [{ text: "Prático", class: "badge-secondary" }],
                rating: 45,
                stars: 5,
                weightKg: 0.2,
                description: "Necessaire transparente ideal para organizar itens da mala maternidade com visualização fácil e rápida.",
                requiresCustomization: true,
                variations: []
            },
            {
                id: 3,
                name: "Capa Caderneta Vacina Porta Documentos Organização Linho",
                price: 124.90,
                installments: 3,
                images: [
                    "images/capa_linho_joaovinicius.jpg?v=1",
                    "images/capa_linho_eloa.jpg?v=1",
                    "images/capa_linho_ester.jpg?v=1",
                    "images/capa_linho_jorge.jpg?v=1",
                    "images/capa_linho_heitor.jpg?v=1"
                ],
                rating: 89,
                stars: 5,
                weightKg: 0.3,
                description: "Capa organizadora em linho para caderneta de vacina e documentos do bebê. Delicada e resistente.",
                requiresCustomization: true,
                variations: []
            },
            {
                id: 4,
                name: "Kit Capa Vacinação / Trocador Portatil - Sintético ou Linho Luxo",
                price: 74.90,
                installments: 3,
                images: ["images/kit_noah_luxury.jpg?v=1"],
                rating: 210,
                stars: 5,
                weightKg: 0.5,
                description: "Kit trocador e capa para vacinação em opções de sintético ou linho luxo. Conforto e praticidade.",
                requiresCustomization: true,
                variations: [{ name: "Material", options: ["Sintético", "Linho Luxo"] }]
            },
            {
                id: 5,
                name: "Mochila Térmica Maternidade Luxo",
                price: 210.00,
                installments: 3,
                images: ["images/mochila_sarah_luxury_v2.png"],
                rating: 34,
                stars: 5,
                weightKg: 0.8,
                badges: [{ text: "Premium", class: "badge-dark" }],
                description: "Mochila térmica espaçosa com design moderno para carregar mamadeiras e todos os itens do bebê.",
                requiresCustomization: true,
                variations: []
            },
            {
                id: 6,
                name: "Kit Necessarie Luxo e Capa Caderneta Vacinação Personalizada",
                price: 209.99,
                installments: 3,
                images: ["images/kit_francisco_1.jpg", "images/kit_francisco_2.jpg"],
                rating: 15,
                stars: 5,
                weightKg: 0.5,
                description: "Kit completo de luxo coordenado contendo:\n\n- 01 Capa para Caderneta de Vacinação com pingente personalizado.\n- 01 Necessaire formato Box estruturada.\n\nFabricado em linho premium com bordados de alta definição (ex: Francisco). Essencial para manter a organização e os documentos do seu bebê maravilhosamente seguros.",
                requiresCustomization: true,
                variations: [{ name: "Cor do Linho", options: ["Bege / Dourado"] }]
            },
            {
                id: 7,
                name: "Chaveiro Personalizado Luxo - Bolsa Maternidade",
                price: 34.90,
                installments: 1,
                images: ["images/chaveiro_mirela_luxury.png"],
                rating: 320,
                stars: 5,
                weightKg: 0.05,
                description: "Chaveiro de luxo personalizado feito com cuidado, ideal para identificar a bolsa de maternidade de forma elegante.",
                requiresCustomization: true,
                variations: []
            },
            {
                id: 8,
                name: "Necessarie Box Baby Personalizada - Suze Bolsas",
                price: 109.99,
                installments: 3,
                images: [
                    "images/necessaire_box_baby_augusto.jpg?v=1",
                    "images/necessaire_box_baby_benicio.jpg?v=1"
                ],
                rating: 56,
                stars: 5,
                weightKg: 0.2,
                description: "Necessaire personalizada em formato Box, estruturada para proteger pequenos itens.",
                requiresCustomization: true,
                variations: []
            },
            {
                id: 9,
                name: "Kit Saquinho Maternidade Personalizado Organizador Luxo",
                price: 79.99,
                installments: 2,
                images: [
                    "images/kit_saquinho_1.jpg?v=1",
                    "images/kit_saquinho_2.jpg?v=1",
                    "images/kit_saquinho_3.jpg?v=1",
                    "images/kit_saquinho_4.jpg?v=1",
                    "images/kit_saquinho_5.jpg?v=1",
                    "images/kit_saquinho_6.jpg?v=1",
                    "images/kit_saquinho_7.jpg?v=1",
                    "images/kit_saquinho_8.jpg?v=1"
                ],
                rating: 145,
                stars: 5,
                weightKg: 0.3,
                description: "O Kit Saquinho Maternidade Personalizado Organizador Luxo Com Nome é a solução perfeita para organização e sofisticação na mala do bebê. Fechamento com zíper e acabamento impecável.",
                requiresCustomization: true,
                variations: [{
                    name: "Quantidade de saquinhos",
                    options: [
                        "1 Unidade",
                        "3 Unidades (R$ 189,99)",
                        "4 Unidades (R$ 239,99)",
                        "5 Unidades (R$ 279,99)",
                        "6 Unidades (R$ 309,99)"
                    ]
                }]
            }
        ];

        let dbProducts = [];

        async function loadProducts() {
            const stored = await _verifyAndLoad();
            if (stored) {
                dbProducts = stored;
            } else {
                dbProducts = defaultProducts;
                await _saveWithSig(dbProducts);
            }
            renderTable();
            document.getElementById('totalProductsCount').textContent = dbProducts.length;
        }

        async function saveProducts() {
            await _saveWithSig(dbProducts);
        }

        function renderTable() {
            const tbody = document.getElementById('productTableBody');
            tbody.innerHTML = '';
            dbProducts.forEach(p => {
                const tr = document.createElement('tr');
                const thumbSrc = p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/40';
                tr.innerHTML = `
                    <td>${parseInt(p.id)}</td>
                    <td><img src="${_esc(thumbSrc)}" alt="thumb" class="product-thumb"></td>
                    <td><strong>${_esc(p.name)}</strong></td>
                    <td>${_esc(p.category || 'N/A')}</td>
                    <td>R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${parseInt(p.id)}" title="Editar"><i class="ph ph-pencil-simple"></i></button>
                        <button class="action-btn text-danger delete-btn" data-id="${parseInt(p.id)}" title="Excluir"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            attachTableEvents();
        }

        // ==========================================================================
        // Form Submission / Edit
        // ==========================================================================
        document.getElementById('productForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const idStr = document.getElementById('productId').value;
            const name = document.getElementById('pName').value.trim();
            const price = parseFloat(document.getElementById('pPrice').value);
            const weight = parseFloat(document.getElementById('pWeight').value);
            const customization = document.getElementById('pCustomization').checked;
            const videoUrl = document.getElementById('pVideoUrl').value.trim();
            const descriptionStr = document.getElementById('pDescription').value.trim();
            const images = [...currentProductImages];

            if (!name || isNaN(price) || price <= 0) {
                alert('Preencha nome e preço válidos.');
                return;
            }
            if (images.length === 0) {
                alert('Você precisa adicionar pelo menos uma imagem.');
                return;
            }

            const variationBlocks = document.querySelectorAll('.variation-block');
            const parsedVariations = [];
            variationBlocks.forEach(block => {
                const vName = block.querySelector('.var-name').value.trim();
                const vOptionsStr = block.querySelector('.var-options').value.trim();
                if (vName && vOptionsStr) {
                    const options = vOptionsStr.split(',').map(o => o.trim()).filter(o => o !== '');
                    if (options.length > 0) parsedVariations.push({ name: vName, options });
                }
            });

            const category = document.getElementById('productCategory').value;

            const newProduct = {
                id: idStr ? parseInt(idStr) : Date.now(),
                name,
                category,
                price,
                installments: 3,
                images,
                videoUrl,
                weightKg: weight,
                description: descriptionStr,
                requiresCustomization: customization,
                rating: 0,
                stars: 5,
                variations: parsedVariations
            };

            if (idStr) {
                const idx = dbProducts.findIndex(p => p.id === parseInt(idStr));
                if (idx > -1) {
                    newProduct.rating = dbProducts[idx].rating;
                    newProduct.stars = dbProducts[idx].stars;
                    dbProducts[idx] = newProduct;
                }
            } else {
                dbProducts.push(newProduct);
            }

            await saveProducts();
            alert('Produto salvo com sucesso! O site principal será atualizado automaticamente.');
            btnCancelProduct.click();
            await loadProducts();
        });

        function attachTableEvents() {
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    const product = dbProducts.find(p => p.id === id);
                    if (!product) return;

                    document.getElementById('productId').value = product.id;
                    document.getElementById('pName').value = product.name;
                    document.getElementById('productCategory').value = product.category || 'Diversos / Toalhas';
                    document.getElementById('pPrice').value = product.price;
                    document.getElementById('pWeight').value = product.weightKg;
                    document.getElementById('pCustomization').checked = product.requiresCustomization;
                    document.getElementById('pVideoUrl').value = product.videoUrl || '';
                    currentProductImages = [...(product.images || [])];
                    renderImagePreviews();

                    let existingDesc = product.description;
                    if (product.richDescription && product.richDescription.length > 0) {
                        existingDesc = product.richDescription.join('\n');
                    }
                    document.getElementById('pDescription').value = existingDesc;

                    document.getElementById('variationsContainer').innerHTML = '';
                    if (product.variations && product.variations.length > 0) {
                        product.variations.forEach(v => createVariationBlock(v.name, v.options.join(', ')));
                    }

                    document.getElementById('formTitle').textContent = 'Editar Produto';
                    views.forEach(v => v.classList.remove('active'));
                    viewForm.classList.add('active');
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idStr = e.currentTarget.getAttribute('data-id');
                    const btnSelf = e.currentTarget;

                    if (!btnSelf.classList.contains('confirming')) {
                        btnSelf.classList.add('confirming');
                        btnSelf.innerHTML = 'Tem certeza?';
                        btnSelf.style.cssText = 'background:#dc3545;color:#fff;padding:0.3rem 0.6rem;border-radius:4px;border:none;cursor:pointer;';
                        setTimeout(() => {
                            if (document.body.contains(btnSelf)) {
                                btnSelf.classList.remove('confirming');
                                btnSelf.innerHTML = '<i class="ph ph-trash"></i>';
                                btnSelf.style.cssText = '';
                            }
                        }, 3000);
                        return;
                    }

                    dbProducts = dbProducts.filter(p => p.id.toString() !== idStr.toString());
                    saveProducts().then(() => loadProducts());

                    const tableBody = document.getElementById('productTableBody');
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="6" style="text-align:center;color:var(--success,green);padding:1rem;">Produto excluído com sucesso!</td>`;
                    tableBody.insertBefore(row, tableBody.firstChild);
                    setTimeout(() => { if (row && document.body.contains(row)) row.remove(); }, 4000);
                });
            });
        }

        // Init
        loadProducts();
    });
}
