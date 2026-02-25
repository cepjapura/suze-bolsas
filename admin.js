/* ==========================================================================
   SuzeAdmin Logic - LocalStorage Mock for Nuvemshop style Dashboard
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Nav Logic
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (!targetId) return;

            // Update Nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update View
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
                <input type="text" class="var-name" placeholder="Ex: Tamanho" value="${name}" required>
            </div>
            <div class="input-group" style="grid-column: span 2;">
                <label>Opções (Separadas por vírgula)</label>
                <input type="text" class="var-options" placeholder="Ex: P, M, G ou Rosa, Azul" value="${options}" required>
            </div>
            <div class="input-group" style="width: max-content;">
                <button type="button" class="btn btn-outline text-danger btn-remove-var" title="Remover" style="padding: 0.8rem; border-color: #ef4444; color: #ef4444;">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        `;

        block.querySelector('.btn-remove-var').addEventListener('click', () => {
            block.remove();
        });

        variationsContainer.appendChild(block);
    }

    btnAddVariation?.addEventListener('click', () => {
        createVariationBlock();
    });

    // ==========================================================================
    // Product Image Upload Logic
    // ==========================================================================
    const pImageUpload = document.getElementById('pImageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    function renderImagePreviews() {
        imagePreviewContainer.innerHTML = ''; // Clear existing previews
        if (currentProductImages.length === 0) {
            imagePreviewContainer.innerHTML = '<p class="text-muted">Nenhuma imagem selecionada.</p>';
            return;
        }
        currentProductImages.forEach((imageSrc, index) => {
            const previewWrapper = document.createElement('div');
            previewWrapper.className = 'image-preview-item';
            previewWrapper.style.cssText = 'position: relative; display: inline-block; margin-right: 10px; margin-bottom: 10px;';

            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.cssText = 'width: 100px; height: 100px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border);';

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-remove-image';
            removeBtn.innerHTML = '<i class="ph ph-x-circle"></i>';
            removeBtn.style.cssText = 'position: absolute; top: -5px; right: -5px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer;';

            removeBtn.addEventListener('click', () => {
                currentProductImages.splice(index, 1); // Remove image from array
                renderImagePreviews(); // Re-render previews
            });

            previewWrapper.appendChild(img);
            previewWrapper.appendChild(removeBtn);
            imagePreviewContainer.appendChild(previewWrapper);
        });
    }

    pImageUpload?.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            // Clear previous images if new ones are selected, or append if desired
            // For now, let's append. If you want to replace, clear currentProductImages here.
            // currentProductImages = [];

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentProductImages.push(e.target.result);
                    renderImagePreviews();
                };
                reader.readAsDataURL(file);
            });
        }
    });

    btnNewProduct.addEventListener('click', () => {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('formTitle').textContent = 'Cadastrar Novo Produto';
        variationsContainer.innerHTML = ''; // Clear variations
        currentProductImages = []; // Clear images for new product
        renderImagePreviews(); // Render empty image previews

        views.forEach(v => v.classList.remove('active'));
        viewForm.classList.add('active');
    });

    btnCancelProduct.addEventListener('click', () => {
        views.forEach(v => v.classList.remove('active'));
        viewProducts.classList.add('active');
        // Reset Nav selection
        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-target="products"]').classList.add('active');
    });

    // ==========================================================================
    // Product Database Simulator (LocalStorage)
    // ==========================================================================

    // Fallback default data from script.js
    const defaultProducts = [
        {
            id: 1,
            name: "Capa para Caderneta de Vacina Linho Luxo / Porta Documentos",
            price: 149.90,
            installments: 3,
            images: ["images/capa_heitor_luxury.png"],
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
            images: ["images/kit_jade_luxury.png"],
            badges: [{ text: "Prático", class: "badge-secondary" }],
            rating: 45,
            stars: 5,
            weightKg: 0.2,
            description: "Necessaire transparente ideal para organizar itens da mala maternidade com visualização fácil e rápida.",
            requiresCustomization: false,
            variations: []
        },
        {
            id: 3,
            name: "Capa Caderneta Vacina Porta Documentos Organização Linho",
            price: 124.90,
            installments: 3,
            images: ["images/capa_mirela_luxury.png"],
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
            images: ["images/hero_banner_1771978019735.png"],
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
            images: ["images/kit_jade_luxury.png"],
            rating: 15,
            stars: 5,
            weightKg: 0.5,
            description: "Kit completo de luxo para organização: necessaire e capa protetora de caderneta de vacinação.",
            requiresCustomization: true,
            variations: []
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
            images: ["images/necessaire_enrico_luxury.png"],
            rating: 56,
            stars: 5,
            weightKg: 0.2,
            description: "Necessaire personalizada em formato Box, estruturada para proteger pequenos itens.",
            requiresCustomization: true,
            variations: []
        }
    ];

    let dbProducts = [];
    let currentProductImages = []; // Holds current edit/create session images

    function renderImagePreviews() {
        const container = document.getElementById('imagePreviewContainer');
        container.innerHTML = '';
        currentProductImages.forEach((dataUrl, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';

            const img = document.createElement('img');
            img.src = dataUrl;
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '4px';

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&times;';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '-5px';
            removeBtn.style.right = '-5px';
            removeBtn.style.background = '#dc3545';
            removeBtn.style.color = '#fff';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '50%';
            removeBtn.style.width = '20px';
            removeBtn.style.height = '20px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.fontSize = '12px';
            removeBtn.style.display = 'flex';
            removeBtn.style.alignItems = 'center';
            removeBtn.style.justifyContent = 'center';

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
            files.forEach(file => {
                if (!file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    currentProductImages.push(event.target.result);
                    renderImagePreviews();
                };
                reader.readAsDataURL(file);
            });
            // Clear input so same file can be selected again if needed
            imageUploadInput.value = '';
        });
    }

    function loadProducts() {
        const stored = localStorage.getItem('suze_products');
        if (stored) {
            dbProducts = JSON.parse(stored);
        } else {
            dbProducts = defaultProducts;
            saveProducts();
        }
        renderTable();
        document.getElementById('totalProductsCount').textContent = dbProducts.length;
    }

    function saveProducts() {
        localStorage.setItem('suze_products', JSON.stringify(dbProducts));
    }

    function renderTable() {
        const tbody = document.getElementById('productTableBody');
        tbody.innerHTML = '';

        dbProducts.forEach(p => {
            const tr = document.createElement('tr');

            const thumbSrc = p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/40';

            tr.innerHTML = `
                <td>${p.id}</td>
                <td><img src="${thumbSrc}" alt="thumb" class="product-thumb"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category || 'N/A'}</td>
                <td>R$ ${p.price.toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${p.id}" title="Editar"><i class="ph ph-pencil-simple"></i></button>
                    <button class="action-btn text-danger delete-btn" data-id="${p.id}" title="Excluir"><i class="ph ph-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        attachTableEvents();
    }

    // ==========================================================================
    // Form Submission / Edit
    // ==========================================================================
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const idStr = document.getElementById('productId').value;
        const name = document.getElementById('pName').value.trim();
        const price = parseFloat(document.getElementById('pPrice').value);
        const weight = parseFloat(document.getElementById('pWeight').value);
        const customization = document.getElementById('pCustomization').checked;
        const videoUrl = document.getElementById('pVideoUrl').value.trim();

        // Parse Images
        const images = [...currentProductImages];

        // Parse Description (Shopee format)
        const descriptionStr = document.getElementById('pDescription').value.trim();

        if (images.length === 0) {
            alert('Você precisa adicionar pelo menos uma imagem.');
            return;
        }

        // Parse Variations
        const variationBlocks = document.querySelectorAll('.variation-block');
        const parsedVariations = [];
        variationBlocks.forEach(block => {
            const vName = block.querySelector('.var-name').value.trim();
            const vOptionsStr = block.querySelector('.var-options').value.trim();
            if (vName && vOptionsStr) {
                const options = vOptionsStr.split(',').map(o => o.trim()).filter(o => o !== '');
                if (options.length > 0) {
                    parsedVariations.push({ name: vName, options: options });
                }
            }
        });

        // Collect Category
        const category = document.getElementById('productCategory').value;

        // Build Payload
        const newProduct = {
            id: idStr ? parseInt(idStr) : Date.now(),
            name: name,
            category: category,
            price: price,
            installments: 3, // default
            images: images,
            videoUrl: videoUrl,
            weightKg: weight,
            description: descriptionStr,
            requiresCustomization: customization,
            richDescription: [], // Obsoleto, usando apenas description
            rating: 0,
            stars: 5,
            variations: parsedVariations
        };

        if (idStr) {
            // Update
            const idx = dbProducts.findIndex(p => p.id === parseInt(idStr));
            // Keep existing ratings if updating
            if (idx > -1) {
                newProduct.rating = dbProducts[idx].rating;
                newProduct.stars = dbProducts[idx].stars;
                dbProducts[idx] = newProduct;
            }
        } else {
            // Create
            dbProducts.push(newProduct);
        }

        saveProducts();

        alert("Produto salvo com sucesso! O site principal será atualizado automaticamente.");
        // Go back to list
        btnCancelProduct.click();
        loadProducts();
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

                currentProductImages = [...product.images];
                renderImagePreviews();

                // Reconstructed Description
                let existingDesc = product.description;
                if (product.richDescription && product.richDescription.length > 0) {
                    existingDesc = product.richDescription.join('\n');
                }
                document.getElementById('pDescription').value = existingDesc;

                // Load Variations into UI
                document.getElementById('variationsContainer').innerHTML = '';
                if (product.variations && product.variations.length > 0) {
                    product.variations.forEach(v => {
                        createVariationBlock(v.name, v.options.join(', '));
                    });
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

                // If not confirming yet, enter confirm state
                if (!btnSelf.classList.contains('confirming')) {
                    btnSelf.classList.add('confirming');
                    btnSelf.innerHTML = 'Tem certeza?';
                    btnSelf.style.backgroundColor = '#dc3545';
                    btnSelf.style.color = '#fff';
                    btnSelf.style.padding = '0.3rem 0.6rem';
                    btnSelf.style.borderRadius = '4px';

                    // Revert after 3 seconds if not clicked
                    setTimeout(() => {
                        if (document.body.contains(btnSelf)) {
                            btnSelf.classList.remove('confirming');
                            btnSelf.innerHTML = '<i class="ph ph-trash"></i>';
                            btnSelf.style = '';
                        }
                    }, 3000);
                    return;
                }

                // If already confirming, proceed with deletion
                dbProducts = dbProducts.filter(p => p.id.toString() !== idStr.toString());
                saveProducts();
                loadProducts();

                // Show a non-blocking toast or a small subtext instead of alert
                const tableBody = document.getElementById('productTableBody');
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="6" style="text-align:center; color: var(--success, green); padding: 1rem;">Produto excluído com sucesso!</td>`;
                tableBody.insertBefore(row, tableBody.firstChild);

                setTimeout(() => {
                    if (row && document.body.contains(row)) row.remove();
                }, 4000);
            });
        });
    }

    // Init
    loadProducts();
});
