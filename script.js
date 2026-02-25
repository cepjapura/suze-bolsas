document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Product Database & State
       ========================================================================== */
    let products = [
        {
            id: 1,
            name: "Capa para Caderneta de Vacina Linho Luxo / Porta Documentos",
            price: 149.90,
            installments: 3,
            images: ["images/capa_heitor_luxury.png"],
            rating: 124,
            category: "Capas",
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
            category: "Necessaires / Bolsas",
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
            category: "Capas",
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
            category: "Kits / Trocadores",
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
            category: "Necessaires / Bolsas",
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
            category: "Kits / Trocadores",
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
            category: "Diversos / Toalhas",
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
            category: "Necessaires / Bolsas",
            stars: 5,
            weightKg: 0.2,
            description: "Necessaire personalizada em formato Box, estruturada para proteger pequenos itens.",
            requiresCustomization: true,
            variations: []
        },
        {
            id: 9,
            name: "Máscara de Proteção 3D - Tecido 100% Algodão",
            price: 6.99,
            installments: 1,
            images: ["images/nossa_historia_1771978109505.png"],
            rating: 1240,
            category: "Máscaras",
            stars: 5,
            weightKg: 0.05,
            description: "Máscara anatômica de 100% algodão para proteção com total conforto respiratório.",
            requiresCustomization: false,
            variations: []
        },
        {
            id: 10,
            name: "Máscara 3D Super Luxo, Bordado Inglês",
            price: 12.49,
            installments: 1,
            images: ["images/nossa_historia_1771978109505.png"],
            rating: 344,
            category: "Máscaras",
            stars: 5,
            weightKg: 0.05,
            description: "Combina proteção e estilo com bordado inglês super delicado. Lavável e reutilizável.",
            requiresCustomization: false,
            variations: []
        },
        {
            id: 11,
            name: "Máscara 3D, Anatômica - Tecido Camada Dupla",
            price: 6.29,
            installments: 1,
            images: ["images/nossa_historia_1771978109505.png"],
            rating: 890,
            category: "Máscaras",
            stars: 4,
            weightKg: 0.05,
            description: "Máscara em tecido duplo para maior filtragem. Confortável e com o ajuste ideal para o rosto.",
            requiresCustomization: false,
            variations: []
        },
        {
            id: 12,
            name: "Pano De Prato Barrado, Ponto Cruz Artesanal",
            price: 29.99,
            installments: 1,
            images: ["images/nossa_historia_1771978109505.png"],
            rating: 156,
            category: "Diversos / Toalhas",
            stars: 5,
            weightKg: 0.1,
            description: "Pano de prato lindo e com grande absorção, com acabamento em ponto cruz feito à mão.",
            requiresCustomization: false,
            variations: []
        },
        {
            id: 13,
            name: "Jogo Toalha de Banho, kit 02 peças - Ponto Cruz",
            price: 149.99,
            installments: 3,
            images: ["images/nossa_historia_1771978109505.png"],
            rating: 23,
            category: "Diversos / Toalhas",
            stars: 5,
            weightKg: 0.4,
            description: "Jogo de toalhas requintado composto por 2 peças decoradas com bordado em ponto cruz autêntico.",
            requiresCustomization: true,
            variations: []
        }
    ];

    // Load from Admin Database if exists
    let storedAdminProducts = localStorage.getItem('suze_products');

    // Purge bad cache containing broken Shopee links from prior mock iterations
    if (storedAdminProducts && (
        storedAdminProducts.includes("cf.shopee.com.br") ||
        storedAdminProducts.includes("1771978094346.png") ||
        storedAdminProducts.includes("1771978070228.png") ||
        storedAdminProducts.includes("1771978044311.png") ||
        !storedAdminProducts.includes("necessaire_enrico_luxury.png") ||
        !storedAdminProducts.includes("capa_mirela_luxury.png") ||
        !storedAdminProducts.includes("chaveiro_mirela_luxury.png")
    )) {
        console.warn("Invalid/expired images detected in cache. Purging local storage.");
        localStorage.removeItem('suze_products');
        storedAdminProducts = null;
    }

    if (storedAdminProducts) {
        try {
            const parsed = JSON.parse(storedAdminProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
                products = parsed;
            }
        } catch (e) {
            console.error("Error loading admin products", e);
        }
    } else {
        // First time initialization: populate LocalStorage with Shopee defaults
        localStorage.setItem('suze_products', JSON.stringify(products));
    }

    let cart = [];
    let shippingCost = 0;
    let shippingOption = '';

    // Modal State
    let currentModalProduct = null;
    let selectedVariations = {};

    // Lightbox State
    let lightboxMediaArray = [];
    let currentLightboxIndex = 0;

    /* ==========================================================================
       Render Products dynamically (with optional Category Filter)
       ========================================================================== */
    function renderProducts(categoryFilter = "Todos") {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        productGrid.innerHTML = '';

        let filteredProducts = products;
        if (categoryFilter !== "Todos") {
            filteredProducts = products.filter(p => p.category === categoryFilter);
        }

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); padding: 2rem;">Nenhum produto encontrado nesta categoria.</p>';
        }

        try {
            filteredProducts.forEach(product => {
                const priceVal = parseFloat(product.price) || 0;
                const installmentsVal = parseInt(product.installments) || 3;
                const installmentValue = (priceVal / installmentsVal).toFixed(2).replace('.', ',');
                const formattedPrice = priceVal.toFixed(2).replace('.', ',');

                let badgesHtml = '';
                if (Array.isArray(product.badges) && product.badges.length > 0) {
                    badgesHtml = '<div class="product-badges">';
                    product.badges.forEach(badge => {
                        badgesHtml += `<span class="badge ${badge.class}">${badge.text}</span>`;
                    });
                    badgesHtml += '</div>';
                }

                let starsHtml = '';
                const starsCount = parseInt(product.stars) || 5;
                for (let i = 0; i < 5; i++) {
                    if (i < starsCount) starsHtml += '<i class="ph-fill ph-star"></i>';
                    else starsHtml += '<i class="ph ph-star"></i>';
                }

                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    ${badgesHtml}
                    <div class="product-img-wrapper">
                        <img src="${(product.images && product.images.length > 0) ? product.images[0] : ''}" alt="${product.name}">
                        <button class="wishlist-btn" aria-label="Adicionar aos favoritos"><i class="ph ph-heart"></i></button>
                        <div class="quick-add">
                            <button class="btn btn-primary btn-block open-modal-btn" data-id="${product.id}">
                                Ver Produto <i class="ph ph-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <p class="product-category" style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${product.category || 'Diversos'}</p>
                        <h3 class="product-name"><a href="#">${product.name}</a></h3>
                        <div class="product-rating">
                            ${starsHtml}
                            <span>(${product.rating || 0})</span>
                        </div>
                        <div class="product-price">
                            <span class="price">R$ ${formattedPrice}</span>
                            <span class="installments">ou ${installmentsVal}x de R$ ${installmentValue}</span>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
            });
        } catch (err) {
            console.error("Error rendering products:", err);
            productGrid.innerHTML = `<p style="color: red; padding: 2rem;">Error rendering products. Restarting cache...</p>`;
            localStorage.removeItem('suze_products');
        }

        attachWishlistEvents();
        attachProductModalEvents();
    }

    /* ==========================================================================
       Product Modal Logic (Variations & Customization)
       ========================================================================== */
    const productModal = document.getElementById('productModal');
    const modalOverlay = document.getElementById('productModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');

    function attachProductModalEvents() {
        const btns = document.querySelectorAll('.open-modal-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                openProductModal(productId);
            });
        });

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeProductModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeProductModal);
    }

    function openProductModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        currentModalProduct = product;
        selectedVariations = {}; // Reset selections

        // Populate Data
        const mainImgEl = document.getElementById('modalProductImage');
        const mainImgContainer = document.getElementById('mainImgContainer');
        const videoContainer = document.getElementById('modalVideoContainer');

        // Reset view to image by default
        mainImgContainer.style.display = 'block';
        videoContainer.style.display = 'none';
        videoContainer.innerHTML = ''; // clear previous iframe

        mainImgEl.src = product.images[0];
        document.getElementById('modalProductTitle').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
        document.getElementById('modalProductInstallments').textContent = `em até ${product.installments}x sem juros`;
        document.getElementById('modalRatingCount').textContent = `(${product.rating} avaliações)`;

        const richDescList = document.getElementById('modalRichDescList');
        const fallbackDesc = document.getElementById('modalProductDesc');

        // Descrição Estilo Shopee (Mantendo formatação original de quebra de linhas)
        richDescList.style.display = 'none';

        fallbackDesc.style.display = 'block';
        fallbackDesc.style.whiteSpace = 'pre-wrap'; // Fundamental para exibir quebras de linha igual a Shopee
        fallbackDesc.style.lineHeight = '1.6';
        fallbackDesc.style.color = 'var(--text-light)';
        fallbackDesc.textContent = product.description || '';


        // Gallery Population
        const gallery = document.getElementById('modalGallery');
        gallery.innerHTML = '';

        // Build Lightbox Media Array
        lightboxMediaArray = [];

        // Add Images
        product.images.forEach(img => {
            lightboxMediaArray.push({ type: 'image', url: img });
        });

        // Add Video if present
        if (product.videoUrl) {
            lightboxMediaArray.push({ type: 'video', url: product.videoUrl });
        }

        if (product.images.length > 1 || product.videoUrl) {
            product.images.forEach((imgSrc, index) => {
                const thumb = document.createElement('div');
                thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
                thumb.innerHTML = `<img src="${imgSrc}" alt="Miniatura ${index + 1}">`;
                thumb.addEventListener('click', () => {
                    // Update Active Class
                    gallery.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');

                    // Show Image, Hide Video
                    mainImgContainer.style.display = 'block';
                    videoContainer.style.display = 'none';
                    videoContainer.innerHTML = '';
                    mainImgEl.src = imgSrc;

                    // Sync Lightbox Index
                    currentLightboxIndex = index;
                });
                gallery.appendChild(thumb);
            });

            if (product.videoUrl) {
                const vidThumb = document.createElement('div');
                vidThumb.className = 'gallery-thumb video-thumb';
                vidThumb.innerHTML = `<img src="${product.images[0]}" alt="Video Thumbnail" style="filter: brightness(0.7)">`;
                vidThumb.addEventListener('click', () => {
                    gallery.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                    vidThumb.classList.add('active');

                    // Show Video, Hide Image
                    mainImgContainer.style.display = 'none';
                    videoContainer.style.display = 'block';
                    videoContainer.innerHTML = `<iframe src="${product.videoUrl}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

                    // Sync Lightbox Index (Video is always at the end in our logic)
                    currentLightboxIndex = lightboxMediaArray.length - 1;
                });
                gallery.appendChild(vidThumb);
            }
        }

        // Stars HTML
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < product.stars) starsHtml += '<i class="ph-fill ph-star"></i>';
            else starsHtml += '<i class="ph ph-star"></i>';
        }
        document.getElementById('modalStars').innerHTML = starsHtml;

        // Badges
        let badgesHtml = '';
        if (product.badges) {
            product.badges.forEach(b => badgesHtml += `<span class="badge ${b.class}">${b.text}</span>`);
        }
        document.getElementById('modalBadges').innerHTML = badgesHtml;

        // Render Variations
        const variationsContainer = document.getElementById('modalVariationsContainer');
        variationsContainer.innerHTML = '';

        if (product.variations && product.variations.length > 0) {
            product.variations.forEach((variation, vIndex) => {
                // Auto-select first option
                selectedVariations[variation.name] = variation.options[0];

                const group = document.createElement('div');
                group.className = 'variation-group';

                let optionsHtml = '';
                variation.options.forEach((opt, oIndex) => {
                    const activeClass = oIndex === 0 ? 'active' : '';
                    optionsHtml += `<button class="variation-btn ${activeClass}" data-type="${variation.name}" data-val="${opt}">${opt}</button>`;
                });

                group.innerHTML = `
                    <label class="variation-label">${variation.name}:</label>
                    <div class="variation-options">
                        ${optionsHtml}
                    </div>
                `;
                variationsContainer.appendChild(group);
            });

            // Bind Variation Clicks
            variationsContainer.querySelectorAll('.variation-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const type = e.currentTarget.getAttribute('data-type');
                    const val = e.currentTarget.getAttribute('data-val');
                    selectedVariations[type] = val;

                    // Update Active styling
                    let siblings = e.currentTarget.parentElement.querySelectorAll('.variation-btn');
                    siblings.forEach(s => s.classList.remove('active'));
                    e.currentTarget.classList.add('active');

                    // Note: Here we could extract price differences from string like "04 Unidades (R$ 109,90)" and update modalProductPrice
                });
            });
        }

        // Customization Field Setup
        const customGroup = document.getElementById('modalCustomizationGroup');
        const customInput = document.getElementById('modalCustomName');
        customInput.value = ''; // clear previous
        if (product.requiresCustomization) {
            customGroup.style.display = 'block';
        } else {
            customGroup.style.display = 'none';
        }

        // Show Modal
        productModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        productModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        currentModalProduct = null;

        // Stop video playing in background
        document.getElementById('modalVideoContainer').innerHTML = '';
    }

    // ==========================================================================
    // Lightbox & Navigation Logic
    // ==========================================================================
    const imgContainer = document.getElementById('mainImgContainer');
    const mainImg = document.getElementById('modalProductImage');

    const lightboxOverlay = document.getElementById('zoomLightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideoContainer = document.getElementById('lightboxVideoContainer');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');

    function openLightbox(index) {
        if (!lightboxMediaArray || lightboxMediaArray.length === 0) return;

        currentLightboxIndex = index;
        updateLightboxUI();
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Let the main product modal handle its own overflow
        lightboxVideoContainer.innerHTML = ''; // Stop video
    }

    function updateLightboxUI() {
        if (!lightboxMediaArray || lightboxMediaArray.length === 0) return;

        const media = lightboxMediaArray[currentLightboxIndex];

        if (media.type === 'image') {
            lightboxVideoContainer.style.display = 'none';
            lightboxVideoContainer.innerHTML = '';
            lightboxImg.style.display = 'block';
            lightboxImg.src = media.url;
        } else if (media.type === 'video') {
            lightboxImg.style.display = 'none';
            lightboxImg.src = '';
            lightboxVideoContainer.style.display = 'block';
            lightboxVideoContainer.innerHTML = `<iframe src="${media.url}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }

        // Hide arrows if only 1 item
        if (lightboxMediaArray.length <= 1) {
            lightboxPrevBtn.style.display = 'none';
            lightboxNextBtn.style.display = 'none';
        } else {
            lightboxPrevBtn.style.display = 'flex';
            lightboxNextBtn.style.display = 'flex';
        }
    }

    function nextLightboxItem() {
        currentLightboxIndex++;
        if (currentLightboxIndex >= lightboxMediaArray.length) {
            currentLightboxIndex = 0; // Loop back
        }
        updateLightboxUI();
    }

    function prevLightboxItem() {
        currentLightboxIndex--;
        if (currentLightboxIndex < 0) {
            currentLightboxIndex = lightboxMediaArray.length - 1; // Loop end
        }
        updateLightboxUI();
    }

    if (imgContainer && mainImg) {

        const handleZoomInfo = (e) => {
            // Only strictly apply on desktop screens
            if (window.innerWidth < 992) return;

            e.preventDefault();

            // Calculate Mouse position inside the container relative to its size
            const rect = imgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            // Apply Pan via transform origin
            mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            // Apply Zoom via Scale
            mainImg.style.transform = `scale(2)`; // You can adjust the zoom intensity here

            imgContainer.style.cursor = 'zoom-in';
        };

        const resetZoom = () => {
            if (window.innerWidth < 992) return;
            mainImg.style.transformOrigin = 'center center';
            mainImg.style.transform = `scale(1)`;
        };

        imgContainer.addEventListener("mousemove", handleZoomInfo);

        imgContainer.addEventListener("mouseenter", () => {
            if (window.innerWidth >= 992) {
                mainImg.style.transition = 'transform 0.1s ease'; // Fast transition when panning
            }
        });

        imgContainer.addEventListener("mouseleave", () => {
            mainImg.style.transition = 'transform 0.3s ease'; // Smooth transition back to normal
            resetZoom();
        });

        // Open Lightbox on Click
        imgContainer.addEventListener('click', () => {
            openLightbox(currentLightboxIndex);
        });
    }

    // Lightbox Event Listeners
    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    // Click outside to close (excluding nav arrows and content)
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) closeLightbox();
        });
    }

    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxItem);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxItem);

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;

        if (e.key === 'ArrowRight') {
            nextLightboxItem();
        } else if (e.key === 'ArrowLeft') {
            prevLightboxItem();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // Modal Add To Cart BTN
    document.getElementById('modalAddToCartBtn')?.addEventListener('click', () => {
        if (!currentModalProduct) return;

        let customName = '';
        if (currentModalProduct.requiresCustomization) {
            customName = document.getElementById('modalCustomName').value.trim();
            if (!customName) {
                alert("Por favor, digite o nome que será bordado na peça.");
                document.getElementById('modalCustomName').focus();
                return;
            }
        }

        addToCart(currentModalProduct, selectedVariations, customName);
        closeProductModal();
        openCart();
    });

    document.getElementById('modalBuyNowBtn')?.addEventListener('click', () => {
        const btn = document.getElementById('modalAddToCartBtn');
        if (btn) btn.click(); // Add and open cart
    });

    // Initialize Category Filters
    function initCategoryFilters() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        if (!categoryBtns.length) return;

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all
                categoryBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked
                e.target.classList.add('active');

                // Render filtered products
                const category = e.target.getAttribute('data-category');
                renderProducts(category);
            });
        });
    }

    /* ==========================================================================
       Cart Logic (Advanced)
       ========================================================================== */
    function addToCart(product, variationsMap, customText) {
        // Evaluate dynamic price if product variation has price info "(R$ XXX)"
        let finalPrice = product.price;
        let variationDetails = [];

        for (const [key, val] of Object.entries(variationsMap)) {
            variationDetails.push(`${key}: ${val}`);
            // Simple regex to extract price overrides (e.g. "04 Unidades (R$ 109,90)")
            const match = val.match(/R\$\s?(\d+,\d{2})/);
            if (match) {
                finalPrice = parseFloat(match[1].replace(',', '.'));
            }
        }

        // Create a unique hash for the cart item so identical baselines don't merge if customizations vary
        const itemHash = `${product.id}-${JSON.stringify(variationsMap)}-${customText}`;

        const existingItem = cart.find(item => item.hash === itemHash);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                hash: itemHash,
                product: product,
                id: product.id,
                name: product.name,
                unitPrice: finalPrice,
                image: product.images[0],
                weightKg: product.weightKg,
                quantity: 1,
                variations: variationDetails,
                customText: customText
            });
        }
        updateCartUI();
    }

    function removeFromCartByHash(hash) {
        cart = cart.filter(item => item.hash !== hash);
        updateCartUI();
    }

    function updateQuantityByHash(hash, newQuantity) {
        if (newQuantity < 1) return;
        const item = cart.find(item => item.hash === hash);
        if (item) {
            item.quantity = newQuantity;
            updateCartUI();
        }
    }

    function updateCartUI() {
        // Update Cart badget count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEls = document.querySelectorAll('.cart-count');
        cartCountEls.forEach(el => el.textContent = totalItems);

        const container = document.getElementById('cartItemsContainer');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="ph ph-shopping-bag"></i>
                    <p>Seu carrinho está vazio.</p>
                    <button class="btn btn-outline" id="continueShoppingBtn">Continuar Comprando</button>
                </div>
            `;
            const continueBtn = document.getElementById('continueShoppingBtn');
            if (continueBtn) continueBtn.addEventListener('click', closeCart);

            document.getElementById('cartSubtotalValue').textContent = 'R$ 0,00';
            document.getElementById('cartTotalValue').textContent = 'R$ 0,00';
            shippingCost = 0;
            const shipRes = document.getElementById('shippingResult');
            if (shipRes) shipRes.innerHTML = '';
            return;
        }

        let html = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.unitPrice * item.quantity;
            subtotal += itemTotal;
            const formattedPrice = item.unitPrice.toFixed(2).replace('.', ',');

            // Build variation strings
            let metaHtml = '';
            if (item.variations.length > 0) {
                metaHtml += `<div style="font-size:0.8rem; color:var(--text-light); margin-bottom:4px;">${item.variations.join(' | ')}</div>`;
            }
            if (item.customText) {
                metaHtml += `<div style="font-size:0.8rem; color:var(--primary); font-weight:500;"><i class="ph ph-pen-nib"></i> Bordar: ${item.customText}</div>`;
            }

            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        ${metaHtml}
                        <div class="cart-item-price">R$ ${formattedPrice}</div>
                        <div class="cart-item-actions">
                            <div class="qty-controls">
                                <button class="qty-btn btn-minus" data-hash="${item.hash}">-</button>
                                <input type="text" class="qty-input" value="${item.quantity}" readonly>
                                <button class="qty-btn btn-plus" data-hash="${item.hash}">+</button>
                            </div>
                            <button class="remove-item-btn" data-hash="${item.hash}">Remover</button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Totals
        const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
        const finalTotal = subtotal + shippingCost;
        const formattedTotal = finalTotal.toFixed(2).replace('.', ',');

        document.getElementById('cartSubtotalValue').textContent = `R$ ${formattedSubtotal}`;
        const totalEl = document.getElementById('cartTotalValue');
        if (totalEl) totalEl.textContent = `R$ ${formattedTotal}`;

        // Event Listeners for Cart Buttons
        container.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hash = e.currentTarget.getAttribute('data-hash');
                const item = cart.find(i => i.hash === hash);
                if (item && item.quantity > 1) updateQuantityByHash(hash, item.quantity - 1);
            });
        });

        container.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hash = e.currentTarget.getAttribute('data-hash');
                const item = cart.find(i => i.hash === hash);
                if (item) updateQuantityByHash(hash, item.quantity + 1);
            });
        });

        container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hash = e.currentTarget.getAttribute('data-hash');
                removeFromCartByHash(hash);
            });
        });
    }

    /* ==========================================================================
       Side Cart Drawer Logic
       ========================================================================== */
    const sideCart = document.getElementById('sideCart');
    const sideCartOverlay = document.getElementById('cartOverlay');
    const closeCartBtnHeader = document.getElementById('closeCartBtn');
    const headerCartBtns = document.querySelectorAll('.cart-btn');

    function openCart() {
        if (sideCart && sideCartOverlay) {
            sideCart.classList.add('active');
            sideCartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Recalculate shipping if an option is active and total changed
            if (shippingOption) {
                const calcBtn = document.getElementById('calcShippingBtn');
                if (calcBtn) calcBtn.click();
            }
        }
    }

    function closeCart() {
        if (sideCart && sideCartOverlay) {
            sideCart.classList.remove('active');
            sideCartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    headerCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    });

    if (closeCartBtnHeader) closeCartBtnHeader.addEventListener('click', closeCart);
    if (sideCartOverlay) sideCartOverlay.addEventListener('click', closeCart);

    /* ==========================================================================
       Shipping Calculator (Simulated API Proxy)
       ========================================================================== */
    const calcShippingBtn = document.getElementById('calcShippingBtn');
    const cepInput = document.getElementById('cepInput');
    const shippingResult = document.getElementById('shippingResult');

    if (calcShippingBtn && cepInput && shippingResult) {
        calcShippingBtn.addEventListener('click', async () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) {
                shippingResult.innerHTML = '<span style="color:var(--danger, red);font-size:0.85rem;">Digite um CEP válido com 8 dígitos.</span>';
                return;
            }

            if (cart.length === 0) {
                return;
            }

            shippingResult.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem;">Calculando frete...</span>';

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    shippingResult.innerHTML = '<span style="color:var(--danger, red);font-size:0.85rem;">CEP não encontrado.</span>';
                    return;
                }

                // Calc total weight based on new cart structure
                const totalWeightKg = cart.reduce((sum, item) => sum + (item.weightKg * item.quantity), 0);
                const uf = data.uf;
                let pacBase = 25;
                let sedexBase = 45;

                if (uf === 'SP') { pacBase = 15; sedexBase = 25; }
                else if (['RJ', 'MG', 'ES', 'PR', 'SC', 'RS'].includes(uf)) { pacBase = 20; sedexBase = 35; }
                else if (['MS', 'MT', 'GO', 'DF', 'BA'].includes(uf)) { pacBase = 30; sedexBase = 55; }
                else { pacBase = 45; sedexBase = 80; }

                const weightMultiplier = Math.max(1, Math.ceil(totalWeightKg));
                const pacPrice = pacBase * weightMultiplier;
                const sedexPrice = sedexBase * weightMultiplier;

                // Handle Free Shipping Rule (over R$ 499)
                const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                const isFreeShipping = subtotal > 499;

                let html = '';

                if (isFreeShipping) {
                    html += `
                        <div style="color:var(--success, #16a34a); font-weight:600; margin-bottom:8px; font-size:0.85rem;">
                            <i class="ph-fill ph-check-circle"></i> Parabéns! Você ganhou Frete Grátis (PAC)
                        </div>
                        <label class="shipping-option">
                            <span style="display:flex; gap:5px; align-items:center;">
                                <input type="radio" name="shipping" value="0" data-name="Frete Grátis (PAC)" checked> 
                                Frete Grátis (PAC - ${uf})
                            </span>
                            <strong>Grátis</strong>
                        </label>
                        <label class="shipping-option">
                            <span style="display:flex; gap:5px; align-items:center;">
                                <input type="radio" name="shipping" value="${sedexPrice}" data-name="SEDEX"> 
                                SEDEX (Expresso - ${uf})
                            </span>
                            <strong>R$ ${sedexPrice.toFixed(2).replace('.', ',')}</strong>
                        </label>
                    `;
                    shippingCost = 0;
                    shippingOption = 'Frete Grátis (PAC)';
                } else {
                    html += `
                        <label class="shipping-option">
                            <span style="display:flex; gap:5px; align-items:center;">
                                <input type="radio" name="shipping" value="${pacPrice}" data-name="PAC" checked> 
                                PAC (Econômico - ${uf})
                            </span>
                            <strong>R$ ${pacPrice.toFixed(2).replace('.', ',')}</strong>
                        </label>
                        <label class="shipping-option">
                            <span style="display:flex; gap:5px; align-items:center;">
                                <input type="radio" name="shipping" value="${sedexPrice}" data-name="SEDEX"> 
                                SEDEX (Expresso - ${uf})
                            </span>
                            <strong>R$ ${sedexPrice.toFixed(2).replace('.', ',')}</strong>
                        </label>
                    `;
                    shippingCost = pacPrice;
                    shippingOption = 'PAC';
                }

                shippingResult.innerHTML = html;
                updateCartUI();

                const radios = shippingResult.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        shippingCost = parseFloat(e.target.value);
                        shippingOption = e.target.getAttribute('data-name');
                        updateCartUI();
                    });
                });

            } catch (error) {
                console.error(error);
                shippingResult.innerHTML = '<span style="color:var(--danger, red);font-size:0.85rem;">Erro ao conectar ViaCEP.</span>';
            }
        });
    }

    /* ==========================================================================
       WhatsApp Checkout
       ========================================================================== */
    const checkoutWhatsappBtn = document.getElementById('checkoutWhatsappBtn');

    if (checkoutWhatsappBtn) {
        checkoutWhatsappBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            const phone = "5511999999999";
            let message = "Olá Suze! Gostaria de fazer o seguinte pedido personalizado:\n\n";

            cart.forEach((item, index) => {
                const itemTotal = item.unitPrice * item.quantity;
                message += `*Item ${index + 1}:* ${item.quantity}x ${item.name} (R$ ${itemTotal.toFixed(2).replace('.', ',')})\n`;
                if (item.variations.length > 0) {
                    message += `  > *Opções:* ${item.variations.join(' | ')}\n`;
                }
                if (item.customText) {
                    message += `  > *Nome a Bordar:* ${item.customText}\n`;
                }
                message += '\n';
            });

            const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
            message += `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}`;

            if (shippingOption) {
                message += `\n*Frete (${shippingOption}):* R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
            }

            const finalTotal = subtotal + shippingCost;
            message += `\n*Total:* R$ ${finalTotal.toFixed(2).replace('.', ',')}\n\n`;
            message += "Aguardo retorno!";

            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    /* ==========================================================================
       Mercado Pago Checkout (Frontend Logic)
       ========================================================================== */
    const checkoutMercadoPagoBtn = document.getElementById('checkoutMercadoPagoBtn');

    if (checkoutMercadoPagoBtn) {
        checkoutMercadoPagoBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            const items = cart.map(item => {
                // Incorporate variation and custom text into the title so it appears on the MP receipt
                let titleParts = [item.name];
                if (item.customText) titleParts.push(`(Bordado: ${item.customText})`);
                if (item.variations.length > 0) titleParts.push(`[${item.variations.join(', ')}]`);

                return {
                    id: item.id,
                    title: titleParts.join(' '),
                    unit_price: item.unitPrice,
                    quantity: item.quantity,
                    currency_id: "BRL"
                };
            });

            if (shippingCost > 0) {
                items.push({
                    id: "shipping",
                    title: `Frete - ${shippingOption}`,
                    unit_price: shippingCost,
                    quantity: 1,
                    currency_id: "BRL"
                });
            }

            const preferencePayload = {
                items: items,
                back_urls: { success: window.location.href, failure: window.location.href, pending: window.location.href },
                auto_return: "approved"
            };

            console.log("Mercado Pago Payload:", preferencePayload);
            alert("Atenção: Carrinho processado pelo Front-End com sucesso. Para abrir o Checkout do Mercado Pago, insira as credenciais no Backend gerando uma Preference API.");
        });
    }

    // Initialize UI
    updateCartUI();
    renderProducts();
    initCategoryFilters();

    /* ==========================================================================
       Header & UI Events
       ========================================================================== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
    });

    const closeNav = () => {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
    };

    closeMenuBtn?.addEventListener('click', closeNav);
    mobileNavOverlay?.addEventListener('click', closeNav);
    mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faq => faq.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    function attachWishlistEvents() {
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        wishlistBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const icon = newBtn.querySelector('i');
                if (icon.classList.contains('ph-heart')) {
                    icon.classList.remove('ph-heart');
                    icon.classList.add('ph-fill', 'ph-heart');
                    icon.style.color = 'var(--primary)';
                } else {
                    icon.classList.remove('ph-fill', 'ph-heart');
                    icon.classList.add('ph-heart');
                    icon.style.color = '';
                }
            });
        });
    }
});
