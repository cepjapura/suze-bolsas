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
            images: ["images/necessaire_henrique.jpg"],
            badges: [{ text: "Prático", class: "badge-secondary" }],
            rating: 45,
            category: "Necessaires / Bolsas",
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
            images: ["images/kit_oliver_luxury.png"],
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
            images: ["images/kit_francisco_1.jpg", "images/kit_francisco_2.jpg"],
            rating: 15,
            category: "Kits / Trocadores",
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
        }
    ];

    // Load from Admin Database if exists
    let storedAdminProducts = localStorage.getItem('suze_products');

    // Purge bad cache containing broken Shopee links from prior mock iterations
    if (storedAdminProducts && (
        storedAdminProducts.includes("cf.shopee.com.br") ||
        storedAdminProducts.includes("1771978094346.png") ||
        !storedAdminProducts.includes("kit_francisco_1.jpg") ||
        !storedAdminProducts.includes("necessaire_enrico_luxury.png") ||
        !storedAdminProducts.includes("necessaire_henrique.jpg") ||
        !storedAdminProducts.includes("capa_mirela_luxury.png") ||
        !storedAdminProducts.includes("chaveiro_mirela_luxury.png") ||
        !storedAdminProducts.includes("kit_oliver_luxury.png")
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
                        <a href="produto.html?id=${product.id}">
                            <img src="${(product.images && product.images.length > 0) ? product.images[0] : ''}" alt="${product.name}">
                        </a>
                        <button class="wishlist-btn" aria-label="Adicionar aos favoritos"><i class="ph ph-heart"></i></button>
                        <div class="quick-add">
                            <button class="btn btn-primary btn-block view-product-btn" onclick="window.location.href='produto.html?id=${product.id}'; return false;">
                                Ver Produto <i class="ph ph-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <p class="product-category" style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${product.category || 'Diversos'}</p>
                        <h3 class="product-name"><a href="produto.html?id=${product.id}">${product.name}</a></h3>
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
        // openCart() is now handled inside addToCart directly
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
    function addToCart(product, variationsMap = {}, customText = '', quantity = 1) {
        // Evaluate dynamic price if product variation has price info "(R$ XXX)"
        let finalPrice = product.price;
        let variationDetails = [];

        for (const [key, val] of Object.entries(variationsMap || {})) {
            variationDetails.push(`${key}: ${val}`);
            // Simple regex to extract price overrides (e.g. "04 Unidades (R$ 109,90)")
            const match = typeof val === 'string' ? val.match(/R\$\s?(\d+,\d{2})/) : null;
            if (match) {
                finalPrice = parseFloat(match[1].replace(',', '.'));
            }
        }

        // Create a unique hash for the cart item so identical baselines don't merge if customizations vary
        const itemHash = `${product.id}-${JSON.stringify(variationsMap || {})}-${customText}`;

        const existingItem = cart.find(item => item.hash === itemHash);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                hash: itemHash,
                product: product,
                id: product.id,
                name: product.name,
                unitPrice: finalPrice,
                image: (product.images && product.images.length > 0) ? product.images[0] : '',
                weightKg: product.weightKg,
                quantity: quantity,
                variations: variationDetails,
                customText: customText
            });
        }
        updateCartUI();
        openCart(); // Automatically open cart sidebar when adding items
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
       Shipping Calculator (Offline Fallback per UF)
       ========================================================================== */
    function calculateOfflineShipping(uf, weightKg) {
        let pacPrice = 35;
        let sedexPrice = 55;
        let pacPrazo = '8';
        let sedexPrazo = '4';
        
        const sul = ['PR', 'SC', 'RS'];
        const sudeste = ['SP', 'RJ', 'MG', 'ES'];
        const centroOeste = ['MT', 'MS', 'GO', 'DF'];
        const nordeste = ['BA', 'PE', 'CE', 'PB', 'RN', 'AL', 'SE', 'PI', 'MA'];
        const norte = ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'];

        if (sul.includes(uf)) { pacPrice = 25; sedexPrice = 45; pacPrazo = '5'; sedexPrazo = '2'; }
        else if (sudeste.includes(uf)) { pacPrice = 30; sedexPrice = 50; pacPrazo = '6'; sedexPrazo = '3'; }
        else if (centroOeste.includes(uf)) { pacPrice = 45; sedexPrice = 65; pacPrazo = '9'; sedexPrazo = '5'; }
        else if (nordeste.includes(uf)) { pacPrice = 65; sedexPrice = 85; pacPrazo = '12'; sedexPrazo = '7'; }
        else if (norte.includes(uf)) { pacPrice = 75; sedexPrice = 105; pacPrazo = '15'; sedexPrazo = '9'; }
        
        if (weightKg > 1) {
            pacPrice += (weightKg - 1) * 3;
            sedexPrice += (weightKg - 1) * 7;
        }

        return { pacPrice, sedexPrice, pacPrazo, sedexPrazo };
    }
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
                const cepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await cepRes.json();

                if (data.erro) {
                    shippingResult.innerHTML = '<span style="color:var(--danger, red);font-size:0.85rem;">CEP não encontrado.</span>';
                    return;
                }
                const uf = data.uf;
                const totalWeightKg = cart.reduce((sum, item) => sum + (item.weightKg * item.quantity), 0) || 1;

                const { pacPrice, sedexPrice, pacPrazo, sedexPrazo } = calculateOfflineShipping(uf, totalWeightKg);

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
       Multi-Step Checkout Logic
       ========================================================================== */
    const cartStep1 = document.getElementById('cartStep1');
    const cartStep2 = document.getElementById('cartStep2');
    const cartStep3 = document.getElementById('cartStep3');
    const step1Indicator = document.getElementById('step1Indicator');
    const step2Indicator = document.getElementById('step2Indicator');
    const step3Indicator = document.getElementById('step3Indicator');

    const btnGoToStep2 = document.getElementById('btnGoToStep2');
    const btnBackToStep1 = document.getElementById('btnBackToStep1');
    const btnGoToStep3 = document.getElementById('btnGoToStep3');

    function resetStepsToCart() {
        cartStep1.style.display = 'flex';
        cartStep2.style.display = 'none';
        cartStep3.style.display = 'none';

        step1Indicator.classList.add('active');
        step2Indicator.classList.remove('active');
        step3Indicator.classList.remove('active');
    }

    if (btnGoToStep2 && btnBackToStep1 && btnGoToStep3) {
        // From Cart to Delivery Info
        btnGoToStep2.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }
            if (!shippingOption) {
                alert("Por favor, calcule e selecione o frete antes de continuar.");
                return;
            }

            cartStep1.style.display = 'none';
            cartStep2.style.display = 'flex';
            cartStep3.style.display = 'none';

            step1Indicator.classList.remove('active');
            step2Indicator.classList.add('active');
            step3Indicator.classList.remove('active');
        });

        // From Delivery Info back to Cart
        btnBackToStep1.addEventListener('click', resetStepsToCart);

        // From Delivery Info to Payment Redirect
        btnGoToStep3.addEventListener('click', async () => {
            // Basic Form Validation
            const name = document.getElementById('checkoutName').value.trim();
            const email = document.getElementById('checkoutEmail').value.trim();
            const phone = document.getElementById('checkoutPhone').value.trim();
            const cpf = document.getElementById('checkoutCPF').value.trim();
            const cep = document.getElementById('checkoutCEP').value.trim();
            const street = document.getElementById('checkoutStreet').value.trim();
            const number = document.getElementById('checkoutNumber').value.trim();
            const neighborhood = document.getElementById('checkoutNeighborhood').value.trim();
            const city = document.getElementById('checkoutCity').value.trim();
            const state = document.getElementById('checkoutState').value.trim();

            if (!name || !email || !cpf || !cep || !street || !number || !neighborhood || !city || !state) {
                alert("Por favor, preencha todos os campos obrigatórios (*).");
                return;
            }

            // Move to Step 3 (Loading Screen)
            cartStep1.style.display = 'none';
            cartStep2.style.display = 'none';
            cartStep3.style.display = 'flex';

            step1Indicator.classList.remove('active');
            step2Indicator.classList.remove('active');
            step3Indicator.classList.add('active');

            // Build WhatsApp Message Payload
            let itemsText = '';
            let orderSubtotal = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.unitPrice * item.quantity;
                orderSubtotal += itemTotal;
                
                itemsText += `*${index + 1}. ${item.name}*\n`;
                itemsText += `   Qtd: ${item.quantity}x de R$ ${item.unitPrice.toFixed(2).replace('.', ',')} = R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
                if (item.variations && item.variations.length > 0) {
                    itemsText += `   Detalhes: ${item.variations.join(' | ')}\n`;
                }
                if (item.customText) {
                    itemsText += `   Bordado: *${item.customText}*\n`;
                }
                itemsText += '\n';
            });

            const finalTotal = orderSubtotal + shippingCost;
            const complement = document.getElementById('checkoutComplement').value.trim();
            const complementText = complement ? ` - ${complement}` : '';
            
            let message = `Olá Suze Bolsas! 👋\nGostaria de finalizar meu pedido.\n\n`;
            message += `🛍️ *MEU PEDIDO*\n${itemsText}`;
            message += `🚚 *FRETE*\n   Modalidade: ${shippingOption}\n   Valor: R$ ${shippingCost.toFixed(2).replace('.', ',')}\n\n`;
            message += `💰 *TOTAL A PAGAR: R$ ${finalTotal.toFixed(2).replace('.', ',')}*\n\n`;
            message += `👤 *MEUS DADOS*\n   Nome: ${name}\n   CPF: ${cpf}\n   E-mail: ${email}\n   Tel: ${phone}\n\n`;
            message += `📍 *ENDEREÇO DE ENTREGA*\n   ${street}, ${number}${complementText}\n   Bairro: ${neighborhood}\n   ${city} - ${state}\n   CEP: ${cep}\n\n`;
            message += `Aguardando código Pix para pagamento!`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappLink = `https://wa.me/5544920002854?text=${encodedMessage}`;

            // Simulate loading display briefly, then redirect
            setTimeout(() => {
                window.location.href = whatsappLink;
            }, 1800);
        });
    }

    /* CEP Auto-fill for Checkout Form */
    const btnSearchCheckoutCEP = document.getElementById('btnSearchCheckoutCEP');
    if (btnSearchCheckoutCEP) {
        btnSearchCheckoutCEP.addEventListener('click', async () => {
            const cepInput = document.getElementById('checkoutCEP');
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) return;

            btnSearchCheckoutCEP.textContent = '...';
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    document.getElementById('checkoutStreet').value = data.logradouro;
                    document.getElementById('checkoutNeighborhood').value = data.bairro;
                    document.getElementById('checkoutCity').value = data.localidade;
                    document.getElementById('checkoutState').value = data.uf;
                    // Move focus to number
                    document.getElementById('checkoutNumber').focus();
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (e) {
                console.error("CEP error", e);
            }
            btnSearchCheckoutCEP.textContent = 'Buscar';
        });
    }

    /* ==========================================================================
       Mercado Pago Checkout (Frontend Logic)
       Removido temporariamente. Fechamento 100% via WhatsApp.
       ========================================================================== */

    /* ==========================================================================
       PRODUCT PAGE LOGIC (produto.html)
       ========================================================================== */
    function initProductPage() {
        if (!window.location.pathname.includes('produto.html')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Loose equality (==) because URL param is a string and our database IDs might be numbers
        const product = products.find(p => p.id == productId);

        if (!product) {
            document.getElementById('dynamicProductArea').innerHTML = `
                <div class="container text-center" style="padding: 100px 0;">
                    <h2>Produto não encontrado</h2>
                    <p>Desculpe, o produto que você está procurando não existe ou está indisponível.</p>
                    <a href="index.html" class="btn btn-primary mt-2">Voltar para a loja</a>
                </div>
            `;
            return;
        }

        // --- Populate Details ---
        document.title = `${product.name} | Suze Bolsas`;
        document.getElementById('bcCategory').textContent = product.category || 'Diversos';
        document.getElementById('bcProductName').textContent = product.name;
        document.getElementById('pageProductTitle').textContent = product.name;
        
        // Badges
        const badgesContainer = document.getElementById('pageBadges');
        badgesContainer.innerHTML = '';
        if (product.badges) {
            product.badges.forEach(b => {
                const span = document.createElement('span');
                span.className = `badge ${b.class}`;
                span.textContent = b.text;
                badgesContainer.appendChild(span);
            });
        }

        // Rating
        const starsContainer = document.getElementById('pageStars');
        starsContainer.innerHTML = '';
        if (product.rating !== undefined) {
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                star.className = i < Math.floor(product.stars || 5) ? 'ph-fill ph-star' : 'ph ph-star';
                starsContainer.appendChild(star);
            }
            document.getElementById('pageRatingCount').textContent = `(${product.rating} avaliações)`;
            document.getElementById('tabReviewCount').textContent = `(${product.rating})`;
        } else {
            starsContainer.innerHTML = '<i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i>';
            document.getElementById('pageRatingCount').textContent = '(0 avaliações)';
            document.getElementById('tabReviewCount').textContent = '(0)';
        }

        // Price
        document.getElementById('pageProductPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
        if (product.installments) {
            const installmentValue = product.price / product.installments;
            document.getElementById('pageProductInstallments').textContent = `ou ${product.installments}x de R$ ${installmentValue.toFixed(2).replace('.', ',')} sem juros`;
            document.getElementById('pageProductInstallments').style.display = 'block';
        } else {
            document.getElementById('pageProductInstallments').style.display = 'none';
        }

        // Short Desc/Highlights
        const richDescList = document.getElementById('pageRichDescList');
        richDescList.innerHTML = '';
        if (product.richHighlights) {
            product.richHighlights.forEach(highlight => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${highlight}`;
                richDescList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${product.description}`;
            richDescList.appendChild(li);
        }

        // Long Description Tab
        const longDescContainer = document.getElementById('pageLongDescription');
        if (product.longDescription) {
            longDescContainer.innerHTML = product.longDescription;
        } else {
            longDescContainer.innerHTML = `<p>${product.description}</p>`;
            if (product.richHighlights) {
                longDescContainer.innerHTML += `<h4>Destaques:</h4><ul>`;
                product.richHighlights.forEach(h => { longDescContainer.innerHTML += `<li>${h}</li>`; });
                longDescContainer.innerHTML += `</ul>`;
            }
        }

        // Customization
        const customGroup = document.getElementById('pageCustomizationGroup');
        const customNameInput = document.getElementById('pageCustomName');
        if (product.requiresCustomization) {
            customGroup.style.display = 'block';
            customNameInput.value = '';
        } else {
            customGroup.style.display = 'none';
        }

        // --- Gallery ---
        const mainImg = document.getElementById('pageProductImage');
        const mainImgContainer = document.getElementById('pageMainImgContainer');
        const galleryContainer = document.getElementById('pageGallery');
        const videoContainer = document.getElementById('pageVideoContainer');

        // Lupa de Zoom Interativo na Página de Produto
        if (mainImgContainer && mainImg) {
            const handlePageZoom = (e) => {
                if (window.innerWidth < 992) return;
                e.preventDefault();
                const rect = mainImgContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
                mainImg.style.transform = `scale(2.2)`; 
            };
            const resetPageZoom = () => {
                if (window.innerWidth < 992) return;
                mainImg.style.transformOrigin = 'center center';
                mainImg.style.transform = `scale(1)`;
            };
            mainImgContainer.addEventListener("mousemove", handlePageZoom);
            mainImgContainer.addEventListener("mouseenter", () => {
                if (window.innerWidth >= 992) mainImg.style.transition = 'transform 0.1s ease-out';
            });
            mainImgContainer.addEventListener("mouseleave", () => {
                mainImg.style.transition = 'transform 0.3s ease-out';
                resetPageZoom();
            });
        }
        
        const allImages = product.images || [];
        if (allImages.length > 0) {
            mainImg.src = allImages[0];
        }
        videoContainer.style.display = 'none';
        galleryContainer.innerHTML = '';

        if (allImages.length > 1 || product.videoUrl) {
            // Video Thumbnail First (if exists)
            if (product.videoUrl) {
                const thumb = document.createElement('img');
                thumb.src = allImages[0] || ''; // Use main image as placeholder thumb for video
                thumb.className = 'page-thumb';
                thumb.alt = 'Video Thumbnail';
                
                // Add play icon overlay visually
                const thumbWrapper = document.createElement('div');
                thumbWrapper.style.position = 'relative';
                thumbWrapper.style.display = 'inline-block';
                
                const playIcon = document.createElement('i');
                playIcon.className = 'ph-fill ph-play-circle';
                playIcon.style.position = 'absolute';
                playIcon.style.top = '50%';
                playIcon.style.left = '50%';
                playIcon.style.transform = 'translate(-50%, -50%)';
                playIcon.style.color = 'white';
                playIcon.style.fontSize = '2rem';
                playIcon.style.pointerEvents = 'none';
                
                thumbWrapper.appendChild(thumb);
                thumbWrapper.appendChild(playIcon);

                thumbWrapper.addEventListener('click', () => {
                    document.querySelectorAll('.page-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    mainImg.style.display = 'none';
                    videoContainer.style.display = 'block';
                    
                    if (!videoContainer.hasChildNodes()) {
                       // Only inject iframe once
                       const iframe = document.createElement('iframe');
                       const videoIdMatch = product.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
                       const videoId = videoIdMatch ? videoIdMatch[1] : null;
                       
                       if(videoId) {
                           iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
                           iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                           iframe.allowFullscreen = true;
                           videoContainer.appendChild(iframe);
                       }
                    }
                });
                galleryContainer.appendChild(thumbWrapper);
            }

            allImages.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.className = 'page-thumb' + (index === 0 && !product.videoUrl ? ' active' : '');
                thumb.alt = `${product.name} ${index + 1}`;
                
                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.page-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    mainImg.src = imgSrc;
                    mainImg.style.display = 'block';
                    videoContainer.style.display = 'none';
                    // Stop video if playing
                    if(videoContainer.firstChild) videoContainer.innerHTML = '';
                });
                galleryContainer.appendChild(thumb);
            });
        }

        // --- Tabs Logic ---
        const tabBtns = document.querySelectorAll('.product-tabs-section .tab-btn');
        const tabContents = document.querySelectorAll('.product-tabs-section .tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        // --- Variations ---
        const pageVarContainer = document.getElementById('pageVariationsContainer');
        window.pageSelectedVariations = {}; // Global scoped variable for variations

        if (pageVarContainer) {
            pageVarContainer.innerHTML = '';
            
            if (product.variations && product.variations.length > 0) {
                product.variations.forEach(variation => {
                    const groupTitle = variation.name; // e.g., "Cor"
                    const options = variation.options;
                    
                    if (options.length === 0) return;
                    
                    window.pageSelectedVariations[groupTitle] = options[0];

                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'page-variation-group';
                    
                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'page-variation-label';
                    labelDiv.innerHTML = `<strong>${groupTitle}:</strong> <span class="var-value-display">${options[0]}</span>`;
                    
                    const optsDiv = document.createElement('div');
                    optsDiv.className = 'page-variation-options';
                    
                    options.forEach((opt, idx) => {
                        const box = document.createElement('div');
                        box.className = 'page-variation-box' + (idx === 0 ? ' active' : '');
                        
                        // Fake mapping option visual to images
                        const fallbackImg = product.images && product.images.length > 0 
                                            ? product.images[Math.min(idx, product.images.length - 1)] 
                                            : '';
                        
                        box.innerHTML = `<img src="${fallbackImg}" alt="${opt}">`;

                        box.addEventListener('click', () => {
                            optsDiv.querySelectorAll('.page-variation-box').forEach(b => b.classList.remove('active'));
                            box.classList.add('active');
                            
                            labelDiv.querySelector('.var-value-display').textContent = opt;
                            window.pageSelectedVariations[groupTitle] = opt;

                            // Swap main image
                            if(fallbackImg){
                                mainImg.src = fallbackImg;
                                mainImg.style.display = 'block';
                                if(videoContainer) videoContainer.style.display = 'none';
                                
                                // Update active thumbnail indicator securely
                                document.querySelectorAll('#pageGallery .page-thumb').forEach((t, imgIdx) => {
                                    t.classList.remove('active');
                                    // Make best effort to match 
                                    if(imgIdx === Math.min(idx, product.images.length - 1)) t.classList.add('active');
                                });
                            }
                        });
                        optsDiv.appendChild(box);
                    });
                    
                    groupDiv.appendChild(labelDiv);
                    groupDiv.appendChild(optsDiv);
                    pageVarContainer.appendChild(groupDiv);
                });
            }
        }

        // --- Actions ---
        const qtyInput = document.getElementById('pageProductQty');
        document.querySelector('.page-actions-group .minus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });
        document.querySelector('.page-actions-group .plus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val < 10) qtyInput.value = val + 1;
        });

        document.getElementById('pageAddToCartBtn').addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            const chosenVars = window.pageSelectedVariations || {};
            
            if (product.requiresCustomization) {
                const customName = customNameInput.value.trim();
                if (!customName) {
                    alert("Por favor, digite o nome para bordar.");
                    customNameInput.focus();
                    return;
                }
                addToCart({...product, id: product.id + '-' + customName}, chosenVars, customName, qty);
            } else {
                addToCart(product, chosenVars, '', qty);
            }
        });

        const btnCalc = document.getElementById('pageCalcShippingBtn');
        if(btnCalc) {
            btnCalc.addEventListener('click', async () => {
                const cepInput = document.getElementById('pageCepInput');
                const resultDiv = document.getElementById('pageShippingResult');
                const cep = cepInput.value.replace(/\D/g, '');
                
                if (cep.length !== 8) {
                    resultDiv.innerHTML = '<span style="color:var(--error);">CEP inválido.</span>';
                    return;
                }
                
                btnCalc.textContent = '...';
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        const { pacPrice, sedexPrice, pacPrazo, sedexPrazo } = calculateOfflineShipping(data.uf, product.weightKg || 1);

                        let pacCost = pacPrice;
                        if (product.price > 499) pacCost = 0; // Free shipping rule
                        
                        let html = `<div style="padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); margin-top:0.5rem;">`;
                        html += `<strong>Para ${data.localidade} - ${data.uf}</strong><br>`;
                        if (pacCost === 0) {
                            html += `<span style="color:var(--success); font-weight:bold;">Frete Grátis</span> - Prazo estimado: ${pacPrazo} dias úteis<br>`;
                            html += `Sedex: R$ ${sedexPrice.toFixed(2).replace('.', ',')} - Prazo: ${sedexPrazo} dias úteis`;
                        } else {
                            html += `PAC: R$ ${pacPrice.toFixed(2).replace('.', ',')} - Prazo: ${pacPrazo} dias úteis<br>`;
                            html += `Sedex: R$ ${sedexPrice.toFixed(2).replace('.', ',')} - Prazo: ${sedexPrazo} dias úteis`;
                        }
                        html += `</div>`;
                        resultDiv.innerHTML = html;
                    } else {
                        resultDiv.innerHTML = '<span style="color:var(--error);">CEP não localizado.</span>';
                    }
                } catch(e) {
                      resultDiv.innerHTML = 'Erro ao buscar CEP.';
                }
                btnCalc.textContent = 'OK';
            });
        }

        // --- Compre Junto (Related Products) ---
        const relatedSection = document.getElementById('relatedProductsSection');
        const relatedGrid = document.getElementById('relatedProductGrid');
        
        if (relatedSection && relatedGrid) {
            // Find products in same category, exclude current
            let related = products.filter(p => p.category === product.category && p.id !== product.id);
            // If not enough, fill with others
            if (related.length < 4) {
                const others = products.filter(p => p.category !== product.category && p.id !== product.id);
                related = [...related, ...others];
            }
            
            // Render up to 4
            related.slice(0, 4).forEach(relProduct => {
                const card = document.createElement('div');
                card.className = `product-card`;

                // Link Wrapper
                const linkWrapper = document.createElement('a');
                linkWrapper.href = `produto.html?id=${relProduct.id}`;
                linkWrapper.style.textDecoration = 'none';
                linkWrapper.style.color = 'inherit';
                linkWrapper.style.display = 'block';

                // Image
                const imgContainer = document.createElement('div');
                imgContainer.className = 'product-image';
                const mainImgNode = document.createElement('img');
                mainImgNode.src = relProduct.image;
                mainImgNode.alt = relProduct.title;
                mainImgNode.loading = 'lazy';
                imgContainer.appendChild(mainImgNode);
                
                // Badges
                if (relProduct.badges && relProduct.badges.length > 0) {
                    const badgesDiv = document.createElement('div');
                    badgesDiv.className = 'product-badges';
                    relProduct.badges.forEach(b => {
                        const span = document.createElement('span');
                        span.className = `badge ${b.class}`;
                        span.textContent = b.text;
                        badgesDiv.appendChild(span);
                    });
                    imgContainer.appendChild(badgesDiv);
                }

                linkWrapper.appendChild(imgContainer);

                // Info
                const infoContainer = document.createElement('div');
                infoContainer.className = 'product-info';
                
                const titleNode = document.createElement('h3');
                titleNode.className = 'product-title';
                titleNode.textContent = relProduct.title;
                infoContainer.appendChild(titleNode);

                const priceDivNode = document.createElement('div');
                priceDivNode.className = 'product-price-wrapper';
                const priceNode = document.createElement('span');
                priceNode.className = 'product-price';
                priceNode.textContent = `R$ ${relProduct.price.toFixed(2).replace('.', ',')}`;
                priceDivNode.appendChild(priceNode);
                infoContainer.appendChild(priceDivNode);

                linkWrapper.appendChild(infoContainer);
                card.appendChild(linkWrapper);
                relatedGrid.appendChild(card);
            });
            
            relatedSection.style.display = 'block';
        }
    }

    // Initialize UI
    initProductPage();
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
