/* gundam.vn store — Lab 5 interactive features */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeButtons = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("gms-theme");
  if (savedTheme === "dark") body.classList.add("dark");
  const updateThemeLabels = () => {
    themeButtons.forEach(btn => {
      const dark = body.classList.contains("dark");
      const icon = btn.querySelector(".theme-icon");
      const label = btn.querySelector(".theme-label");
      if (icon) icon.textContent = dark ? "☀" : "☾";
      if (label) label.textContent = dark ? "Sáng" : "Tối";
    });
  };
  updateThemeLabels();
  themeButtons.forEach(btn => btn.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("gms-theme", body.classList.contains("dark") ? "dark" : "light");
    updateThemeLabels();
  }));

  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".mobile-nav") || document.querySelector(".main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mainNav.classList.toggle("is-open", !expanded);
    });
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 600) {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Back-to-top: visible after 300px scroll
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const toggleTopButton = () => backToTop.classList.toggle("visible", window.scrollY > 300);
    window.addEventListener("scroll", toggleTopButton, { passive: true });
    toggleTopButton();
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Product data rendered from JavaScript array
  const products = [
    {id:1,name:"Gundam Aerial Rebuild",line:"HG",category:"hg",price:"420.000₫",desc:"Aerial Rebuild – thiết kế nổi bật với tạo hình trắng xanh.",image:"assets/img/optimized/aerial-rebuild.webp",tag:"FEATURED"},
    {id:2,name:"Strike Gundam",line:"EG",category:"hg",price:"190.000₫",desc:"Entry Grade dễ tiếp cận cho builder mới.",image:"assets/img/optimized/eg-strike.webp",tag:"BEGINNER"},
    {id:3,name:"Banshee Destroy Mode",line:"HG",category:"hg",price:"520.000₫",desc:"Banshee với sắc thái mạnh mẽ ở Destroy Mode.",image:"assets/img/optimized/hg-banshee-destroy-mode.webp",tag:"POPULAR"},
    {id:4,name:"Guncannon",line:"HG",category:"hg",price:"390.000₫",desc:"Mobile suit hỗ trợ hỏa lực tầm trung.",image:"assets/img/optimized/hg-guncannon.webp",tag:"CLASSIC"},
    {id:5,name:"Banshee Norn",line:"RG",category:"rg",price:"890.000₫",desc:"Real Grade với ngoại hình đen vàng ấn tượng.",image:"assets/img/optimized/rg-banshee-norn.webp",tag:"PREMIUM"},
    {id:6,name:"Sazabi",line:"RG",category:"rg",price:"1.150.000₫",desc:"Mẫu mobile suit đỏ nổi bật dành cho trưng bày.",image:"assets/img/optimized/rg-sazabi.webp",tag:"COLLECTOR"},
    {id:7,name:"Wing Gundam Zero",line:"RG",category:"rg",price:"850.000₫",desc:"Wing Zero với bộ cánh đặc trưng và tạo hình thanh thoát.",image:"assets/img/optimized/rg-wing-zero.webp",tag:"FEATURED"},
    {id:8,name:"Astray Gold Frame Amatsu Mina",line:"RG",category:"rg",price:"980.000₫",desc:"Gold Frame Amatsu Mina với phối màu đen vàng.",image:"assets/img/optimized/rg-astray-gold-frame-amatsu-mina.webp",tag:"LIMITED"}
  ];
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("productSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const emptyState = document.getElementById("emptyState");
  let activeCategory = "all";
  const renderProducts = () => {
    if (!productGrid) return;
    const keyword = (searchInput?.value || "").trim().toLocaleLowerCase("vi");
    const filtered = products.filter(product => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const haystack = `${product.name} ${product.line} ${product.desc}`.toLocaleLowerCase("vi");
      return matchesCategory && haystack.includes(keyword);
    });
    productGrid.innerHTML = filtered.map(product => `
      <article class="product-card">
        <div class="product-visual">
          <img src="${product.image}" alt="Mô hình ${product.name}" loading="lazy">
          <span class="product-tag">${product.tag}</span>
        </div>
        <div class="product-info">
          <span class="product-type">${product.line} / MODEL KIT</span>
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <div class="product-bottom"><span class="product-price">${product.price}</span><a class="product-link" href="pages/contact.html">Tư vấn ↗</a></div>
        </div>
      </article>`).join("");
    if (emptyState) emptyState.hidden = filtered.length !== 0;
  };
  if (productGrid) {
    renderProducts();
    searchInput?.addEventListener("input", renderProducts);
    filterButtons.forEach(button => button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      filterButtons.forEach(item => item.classList.toggle("active", item === button));
      renderProducts();
    }));
    document.querySelectorAll("[data-jump-category]").forEach(tile => tile.addEventListener("click", () => {
      activeCategory = tile.dataset.jumpCategory;
      filterButtons.forEach(item => item.classList.toggle("active", item.dataset.category === activeCategory));
      renderProducts();
      document.getElementById("collection")?.scrollIntoView({behavior:"smooth"});
    }));
  }

  // Contact form validation + localStorage persistence
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const status = document.getElementById("formStatus");
    const charCount = document.getElementById("charCount");
    const errorEls = {
      name: document.getElementById("nameError"),
      email: document.getElementById("emailError"),
      message: document.getElementById("messageError")
    };
    messageInput.addEventListener("input", () => {
      charCount.textContent = `${messageInput.value.trim().length} / 20 ký tự tối thiểu`;
    });
    const setError = (input, element, message) => {
      element.textContent = message;
      input.classList.toggle("invalid", Boolean(message));
      input.setAttribute("aria-invalid", String(Boolean(message)));
    };
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const fullName = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const nameError = fullName ? "" : "Vui lòng nhập họ và tên.";
      const emailError = !email ? "Vui lòng nhập email." : (!emailPattern.test(email) ? "Email chưa đúng định dạng." : "");
      const messageError = !message ? "Vui lòng nhập nội dung." : (message.length < 20 ? "Nội dung cần tối thiểu 20 ký tự." : "");
      setError(nameInput, errorEls.name, nameError);
      setError(emailInput, errorEls.email, emailError);
      setError(messageInput, errorEls.message, messageError);
      status.className = "form-status";
      if (nameError || emailError || messageError) {
        status.textContent = "Vui lòng kiểm tra lại thông tin đã nhập.";
        status.classList.add("error");
        return;
      }
      const entry = { fullName, email, message, createdAt: new Date().toISOString() };
      const savedMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
      savedMessages.push(entry);
      localStorage.setItem("contactMessages", JSON.stringify(savedMessages));
      contactForm.reset();
      charCount.textContent = "0 / 20 ký tự tối thiểu";
      status.textContent = "Gửi thành công! Thông tin demo đã được lưu trong trình duyệt.";
      status.classList.add("success");
      console.log("contactMessages:", JSON.parse(localStorage.getItem("contactMessages") || "[]"));
    });
  }
});
