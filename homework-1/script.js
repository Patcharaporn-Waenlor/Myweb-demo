document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE LINKS
     ========================================================================== */
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    // Sticky Header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Link Highlight
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  /* ==========================================================================
     2. MOBILE MENU TOGGLE
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, we can unobserve
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     4. MENU FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        // Simple scale transitions for filtering
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.classList.remove('hidden');
          // Mini trigger for animation
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ==========================================================================
     5. DYNAMIC CAKE CUSTOMIZER
     ========================================================================== */
  // Price list
  const prices = {
    flavors: { vanilla: 0, chocolate: 50, strawberry: 50, matcha: 70 },
    creams: { butter: 0, cheese: 50, chocolate: 40, strawberry: 35 },
    toppings: { 
      strawberry: 60, 
      sprinkle: 20, 
      candle: 15,
      cherry: 45,
      macaron: 75,
      gold: 80,
      oreo: 40
    }
  };

  const baseCakePrice = 450; // Base price for standard cake
  let selectedFlavor = 'vanilla';
  let selectedCream = 'butter';
  let selectedToppings = {
    strawberry: false,
    sprinkle: false,
    candle: false,
    cherry: false,
    macaron: false,
    gold: false,
    oreo: false
  };

  // DOM elements
  const flavorBtns = document.querySelectorAll('[data-step="flavor"]');
  const creamBtns = document.querySelectorAll('[data-step="cream"]');
  const toppingBtns = document.querySelectorAll('[data-step="topping"]');
  const totalPriceEl = document.getElementById('customTotalPrice');
  
  // Cake preview layers
  const cakeLayers = document.querySelectorAll('.cake-layer');
  const cakeCreams = document.querySelectorAll('.cake-cream');
  const toppingStrawberry = document.querySelector('.topping-strawberry');
  const toppingSprinkles = document.querySelectorAll('.topping-sprinkle');
  const cakeCandle = document.querySelector('.candle');
  const toppingCherry = document.querySelector('.topping-cherry');
  const toppingMacarons = document.querySelectorAll('.topping-macaron');
  const toppingGold = document.querySelectorAll('.topping-gold');
  const toppingOreo = document.querySelectorAll('.topping-oreo');

  // Update Price & Preview
  function updateCakeCustomizer() {
    // 1. Calculate price
    let extraFlavorPrice = prices.flavors[selectedFlavor];
    let extraCreamPrice = prices.creams[selectedCream];
    let extraToppingsPrice = 0;

    for (const [top, active] of Object.entries(selectedToppings)) {
      if (active) {
        extraToppingsPrice += prices.toppings[top];
      }
    }

    const finalPrice = baseCakePrice + extraFlavorPrice + extraCreamPrice + extraToppingsPrice;
    totalPriceEl.textContent = `฿${finalPrice}`;

    // 2. Update visual classes
    // Base layers flavor class
    cakeLayers.forEach(layer => {
      // Remove previous flavor classes
      Object.keys(prices.flavors).forEach(f => layer.classList.remove(`flavor-${f}`));
      // Add current flavor class
      layer.classList.add(`flavor-${selectedFlavor}`);
    });

    // Cream icing class
    cakeCreams.forEach(cream => {
      // Remove previous cream classes
      Object.keys(prices.creams).forEach(c => cream.classList.remove(`cream-${c}`));
      // Add current cream class
      cream.classList.add(`cream-${selectedCream}`);
    });

    // Toppings activation
    // Strawberries
    if (selectedToppings.strawberry) {
      toppingStrawberry.classList.add('active');
    } else {
      toppingStrawberry.classList.remove('active');
    }

    // Sprinkles
    if (selectedToppings.sprinkle) {
      toppingSprinkles.forEach(s => s.classList.add('active'));
    } else {
      toppingSprinkles.forEach(s => s.classList.remove('active'));
    }

    // Candle
    if (selectedToppings.candle) {
      cakeCandle.classList.add('active');
    } else {
      cakeCandle.classList.remove('active');
    }

    // Cherries
    if (selectedToppings.cherry) {
      toppingCherry.classList.add('active');
    } else {
      toppingCherry.classList.remove('active');
    }

    // Macarons
    if (selectedToppings.macaron) {
      toppingMacarons.forEach(m => m.classList.add('active'));
    } else {
      toppingMacarons.forEach(m => m.classList.remove('active'));
    }

    // Gold
    if (selectedToppings.gold) {
      toppingGold.forEach(g => g.classList.add('active'));
    } else {
      toppingGold.forEach(g => g.classList.remove('active'));
    }

    // Oreo
    if (selectedToppings.oreo) {
      toppingOreo.forEach(o => o.classList.add('active'));
    } else {
      toppingOreo.forEach(o => o.classList.remove('active'));
    }
  }

  // Set flavor event listeners
  flavorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      flavorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFlavor = btn.getAttribute('data-value');
      
      // Trigger a re-fall animation on layers for interactive feel
      cakeLayers.forEach((layer, idx) => {
        layer.style.animation = 'none';
        layer.offsetHeight; // Trigger reflow
        layer.style.animation = `fallLayer 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${idx * 0.15}s forwards`;
      });
      
      updateCakeCustomizer();
    });
  });

  // Set cream event listeners
  creamBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      creamBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCream = btn.getAttribute('data-value');
      updateCakeCustomizer();
    });
  });

  // Set toppings event listeners
  toppingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const val = btn.getAttribute('data-value');
      selectedToppings[val] = btn.classList.contains('active');
      updateCakeCustomizer();
    });
  });

  // Init customizer
  updateCakeCustomizer();


  /* ==========================================================================
     7. CONTACT FORM VALIDATION & SUCCESS POPUP
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const tel = document.getElementById('contactTel').value.trim();
      const message = document.getElementById('contactMsg').value.trim();
      
      // Basic validation
      if (!name || !email || !message) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน (ชื่อ, อีเมล, และข้อความ)';
        return;
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
        return;
      }

      // Show loader state on button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'กำลังส่งข้อความ...';

      // Simulate API delay
      setTimeout(() => {
        formMessage.className = 'form-message success';
        formMessage.textContent = 'ขอบคุณสำหรับข้อความของคุณ! ทางร้าน Fah Bakery & Café จะติดต่อกลับหาคุณโดยเร็วที่สุด';
        
        // Reset form
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
        
        // Hide message after 8 seconds
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 8000);
      }, 1500);
    });
  }

  /* ==========================================================================
     8. TOAST NOTIFICATIONS (CART ADD / CONTACT ACTION)
     ========================================================================== */
  // Create a Toast container dynamically
  const toastContainer = document.createElement('div');
  toastContainer.style.position = 'fixed';
  toastContainer.style.bottom = '24px';
  toastContainer.style.right = '24px';
  toastContainer.style.zIndex = '9999';
  toastContainer.style.display = 'flex';
  toastContainer.style.flexDirection = 'column';
  toastContainer.style.gap = '10px';
  document.body.appendChild(toastContainer);

  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.backgroundColor = 'var(--bg-dark)';
    toast.style.color = '#FFF';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '50px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.border = '1px solid var(--accent)';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '600';
    toast.style.fontFamily = 'var(--font-body)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.transform = 'translateY(50px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    // Add a checkmark icon
    toast.innerHTML = `
      <svg style="width: 18px; height: 18px; fill: var(--accent);" viewBox="0 0 20 20">
        <path d="M7.629 14.571L3.257 10.2a1 1 0 111.414-1.414l3.664 3.663 8.3-8.3a1 1 0 111.414 1.414l-9.014 9.014a1 1 0 01-1.406 0z"/>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    // Remove toast after 4s
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  // Hook cart buttons
  /* ==========================================================================
     9. SHOPPING CART LOGIC
     ========================================================================== */
  let cart = [];

  // DOM selections
  const cartTrigger = document.getElementById('cartTrigger');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

  // Checkout Modal selections
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutClose = document.getElementById('checkoutClose');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutSummaryList = document.getElementById('checkoutSummaryList');
  const checkoutSummaryTotal = document.getElementById('checkoutSummaryTotal');
  const checkoutSuccessState = document.getElementById('checkoutSuccessState');
  const checkoutSuccessCloseBtn = document.getElementById('checkoutSuccessCloseBtn');
  const checkoutOrderNumber = document.getElementById('checkoutOrderNumber');

  // Open & Close Drawer
  if (cartTrigger && cartClose && cartOverlay) {
    cartTrigger.addEventListener('click', () => {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    });

    cartClose.addEventListener('click', closeCartDrawer);
    cartOverlay.addEventListener('click', closeCartDrawer);
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  // Update Cart Badge & Subtotal
  function updateCartUI() {
    // 1. Calculate count and subtotal
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartBadge) cartBadge.textContent = totalCount;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `฿${subtotal}`;

    // 2. Render list items
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg viewBox="0 0 24 24" style="width: 60px; height: 60px; fill: var(--accent); margin-bottom: 16px; opacity: 0.5;">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          <p>ยังไม่มีสินค้าในตะกร้า</p>
        </div>
      `;
      if (cartCheckoutBtn) {
        cartCheckoutBtn.disabled = true;
        cartCheckoutBtn.style.opacity = '0.5';
        cartCheckoutBtn.style.cursor = 'not-allowed';
      }
    } else {
      if (cartCheckoutBtn) {
        cartCheckoutBtn.disabled = false;
        cartCheckoutBtn.style.opacity = '1';
        cartCheckoutBtn.style.cursor = 'pointer';
      }

      cartItemsContainer.innerHTML = '';
      cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
          <div class="cart-item-img-wrapper">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-price">฿${item.price}</div>
            <div class="cart-item-qty-container">
              <div class="qty-btn dec-btn" data-index="${index}">-</div>
              <span class="qty-val">${item.quantity}</span>
              <div class="qty-btn inc-btn" data-index="${index}">+</div>
              <button class="cart-item-remove" data-index="${index}">ลบ</button>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });

      // Attach quantity adjust listeners
      document.querySelectorAll('.dec-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-index'));
          if (cart[idx].quantity > 1) {
            cart[idx].quantity--;
          } else {
            cart.splice(idx, 1);
          }
          updateCartUI();
        });
      });

      document.querySelectorAll('.inc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-index'));
          cart[idx].quantity++;
          updateCartUI();
        });
      });

      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-index'));
          cart.splice(idx, 1);
          updateCartUI();
        });
      });
    }
  }

  // Add item function
  function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name,
        price,
        image,
        quantity: 1
      });
    }
    updateCartUI();
    // Open drawer
    if (cartDrawer) cartDrawer.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
  }

  // Hook menu item add cart buttons
  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  addCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.menu-card');
      const title = card.querySelector('h3').textContent;
      const priceVal = parseInt(card.querySelector('.menu-card-price').textContent.replace('฿', ''));
      const imgUrl = card.querySelector('img').getAttribute('src');

      addToCart(title, priceVal, imgUrl);
      showToast(`เพิ่ม "${title}" ลงในตะกร้าแล้ว!`);
    });
  });

  // Custom cake order button hook
  const cakeOrderBtn = document.getElementById('orderCustomCake');
  if (cakeOrderBtn) {
    cakeOrderBtn.addEventListener('click', () => {
      // Build a descriptive name of the custom cake
      const thaiFlavors = { vanilla: 'เนื้อวานิลลา', chocolate: 'เนื้อช็อกโกแลต', strawberry: 'เนื้อสตรอว์เบอร์รี่', matcha: 'เนื้อชาเขียว' };
      const thaiCreams = { butter: 'ครีมเนย', cheese: 'ครีมชีส', chocolate: 'ครีมช็อก', strawberry: 'ครีมสตรอว์เบอร์รี่' };
      
      let toppingsList = [];
      if (selectedToppings.strawberry) toppingsList.push('สตรอว์เบอร์รี่');
      if (selectedToppings.sprinkle) toppingsList.push('เกล็ดน้ำตาล');
      if (selectedToppings.candle) toppingsList.push('เทียน');
      if (selectedToppings.cherry) toppingsList.push('เชอร์รี่');
      if (selectedToppings.macaron) toppingsList.push('มาการอง');
      if (selectedToppings.gold) toppingsList.push('ทองคำเปลว');
      if (selectedToppings.oreo) toppingsList.push('โอรีโอ');

      let desc = `เค้กสั่งทำ (${thaiFlavors[selectedFlavor]} + ${thaiCreams[selectedCream]}`;
      if (toppingsList.length > 0) {
        desc += ` + ท็อปปิ้ง: ${toppingsList.join(', ')}`;
      }
      desc += `)`;

      const finalPrice = parseInt(totalPriceEl.textContent.replace('฿', ''));
      const customImg = 'assets/strawberry.png'; // Fallback cake placeholder visual

      addToCart(desc, finalPrice, customImg);
      showToast(`เพิ่มเค้กออกแบบเองลงในตะกร้าแล้ว!`);
    });
  }

  // Open Checkout Modal
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      // Close cart drawer
      closeCartDrawer();

      // Open checkout modal
      if (checkoutModal) checkoutModal.classList.add('active');
      if (checkoutOverlay) checkoutOverlay.classList.add('active');

      // Populating order summary list
      if (checkoutSummaryList) {
        checkoutSummaryList.innerHTML = '';
        cart.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${item.name} <strong>x ${item.quantity}</strong></span>
            <span>฿${item.price * item.quantity}</span>
          `;
          checkoutSummaryList.appendChild(li);
        });
      }

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (checkoutSummaryTotal) checkoutSummaryTotal.textContent = `฿${subtotal}`;
    });
  }

  // Close Checkout Modal
  if (checkoutClose && checkoutOverlay) {
    checkoutClose.addEventListener('click', closeCheckoutModal);
    checkoutOverlay.addEventListener('click', closeCheckoutModal);
  }

  function closeCheckoutModal() {
    if (checkoutModal) checkoutModal.classList.remove('active');
    if (checkoutOverlay) checkoutOverlay.classList.remove('active');
    // Hide success state just in case
    if (checkoutSuccessState) checkoutSuccessState.classList.remove('active');
  }

  // Handle Checkout Confirm Order
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Generate random order number #FH-XXXX
      const randNo = Math.floor(1000 + Math.random() * 9000);
      if (checkoutOrderNumber) checkoutOrderNumber.textContent = `#FH-${randNo}`;

      // Show success screen in modal
      if (checkoutSuccessState) checkoutSuccessState.classList.add('active');

      // Clear the cart
      cart = [];
      updateCartUI();
    });
  }

  // Success button closes modal
  if (checkoutSuccessCloseBtn) {
    checkoutSuccessCloseBtn.addEventListener('click', () => {
      closeCheckoutModal();
    });
  }

  // Initialize UI
  updateCartUI();
});
