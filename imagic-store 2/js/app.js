document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Botões "play" das caixas de som JBL (visual, sem áudio) ---------- */
  document.querySelectorAll('.speaker-play').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = btn.closest('.jbl-card');
      if (!card) return;
      var playing = card.classList.toggle('is-playing');
      btn.textContent = playing ? '❚❚' : '▶';
      if (playing) {
        setTimeout(function () {
          card.classList.remove('is-playing');
          btn.textContent = '▶';
        }, 4000);
      }
    });
  });

  /* ---------- Seleção de Marcas (Modelos) ---------- */
  var brandSelectGrid = document.getElementById('brandSelectGrid');
  var brandDevicesGrid = document.getElementById('brandDevicesGrid');
  var backToBrands = document.getElementById('backToBrands');
  var allBrandCards = brandDevicesGrid ? Array.prototype.slice.call(brandDevicesGrid.children) : [];

  var BRAND_INFO = {
    apple:   { title: 'Apple',   tagline: 'Design que fala por si. Desempenho que acompanha.', chips: ['Aparelhos originais', 'Novos e seminovos', 'Garantia de loja'] },
    samsung: { title: 'Galaxy',  tagline: 'Telas imersivas e câmeras que capturam cada detalhe.', chips: ['Tela AMOLED', 'Câmeras de alta resolução', 'Ecossistema Galaxy'] },
    xiaomi:  { title: 'Xiaomi',  tagline: 'Tecnologia viva, ao alcance de todos.', chips: ['Custo-benefício', 'Câmeras Leica', 'Carregamento rápido'] },
    jbl:     { title: 'JBL',     tagline: 'Som potente para levar para qualquer lugar.', chips: ['Graves profundos', 'À prova d\'água', 'Bateria para o dia todo'] }
  };

  function showBrandDevices(brand) {
    if (!brandDevicesGrid) return;
    allBrandCards.forEach(function (card) {
      card.style.display = card.getAttribute('data-brand') === brand ? '' : 'none';
    });
    var info = BRAND_INFO[brand];
    var brandViewEl = document.getElementById('brandView');
    if (info && brandViewEl) {
      brandViewEl.setAttribute('data-theme', brand);
      var srcImg = document.querySelector('.brand-select-card[data-brand="' + brand + '"] img');
      var logoEl = document.getElementById('brandHeroLogo');
      logoEl.src = srcImg ? srcImg.src : '';
      logoEl.alt = info.title;
      document.getElementById('brandHeroTitle').textContent = info.title;
      document.getElementById('brandHeroTagline').textContent = info.tagline;
      document.getElementById('brandChips').innerHTML = info.chips.map(function (c) { return '<span>' + c + '</span>'; }).join('');
    }
    showView('brandView');
  }

  if (brandSelectGrid) {
    brandSelectGrid.querySelectorAll('.brand-select-card').forEach(function (card) {
      card.addEventListener('click', function () {
        showBrandDevices(card.getAttribute('data-brand'));
      });
    });
  }

  if (backToBrands) {
    backToBrands.addEventListener('click', function () {
      showView('siteView');
      requestAnimationFrame(function () {
        var gallerySection = document.getElementById('gallery');
        if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById('navToggle');
  var navbar = document.getElementById('navbar');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navbar.querySelectorAll('a:not(#stockLink)').forEach(function (link) {
      link.addEventListener('click', function (e) {
        navbar.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');

        var href = link.getAttribute('href');
        if (href && href.charAt(0) === '#' && href.length > 1) {
          var stockViewEl = document.getElementById('stockView');
          var brandViewEl = document.getElementById('brandView');
          var inAltView =
            (stockViewEl && !stockViewEl.classList.contains('page-hidden')) ||
            (brandViewEl && !brandViewEl.classList.contains('page-hidden'));
          if (inAltView) {
            e.preventDefault();
            showSiteView();
            requestAnimationFrame(function () {
              var target = document.querySelector(href);
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
          }
        }
      });
    });
  }

  /* ---------- Header com sombra ao rolar ---------- */
  var header = document.querySelector('header');
  function handleHeaderScroll() {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  var logoLink = document.querySelector('.logo');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      var stockViewEl = document.getElementById('stockView');
      var brandViewEl = document.getElementById('brandView');
      var inAltView =
        (stockViewEl && !stockViewEl.classList.contains('page-hidden')) ||
        (brandViewEl && !brandViewEl.classList.contains('page-hidden'));
      if (inAltView) {
        e.preventDefault();
        showSiteView();
      }
    });
  }

  /* ---------- Link ativo no menu conforme a seção visível ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.navbar a[href^="#"]');

  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + section.id);
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Animação ao entrar na tela ---------- */
  var revealTargets = document.querySelectorAll('.phone-card, .about-stats .stat, .about-text, .map-overlay');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contadores animados nas estatísticas ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Botão "Comprar" pré-preenche o formulário de contato ---------- */
  var buyButtons = document.querySelectorAll('.btn-buy');
  var mensagemField = document.getElementById('mensagemField');

  buyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var model = btn.getAttribute('data-model');
      if (mensagemField) {
        mensagemField.value = 'Tenho interesse no ' + model + '. Pode me passar mais detalhes?';
        mensagemField.classList.add('is-highlighted');
        setTimeout(function () { mensagemField.classList.remove('is-highlighted'); }, 1500);
      }
      var contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(function () {
          if (mensagemField) mensagemField.focus();
        }, 500);
      }
    });
  });

  /* ---------- Acesso protegido ao Estoque ---------- */
  var STOCK_PASSWORD = 'imagic2026'; // altere esta senha conforme desejar

  var stockLink = document.getElementById('stockLink');
  var stockGate = document.getElementById('stockGate');
  var stockGateBox = stockGate ? stockGate.querySelector('.stock-gate-box') : null;
  var stockGateForm = document.getElementById('stockGateForm');
  var stockGatePassword = document.getElementById('stockGatePassword');
  var stockGateError = document.getElementById('stockGateError');
  var stockGateCancel = document.getElementById('stockGateCancel');

  function openStockGate() {
    if (!stockGate) return;
    stockGate.classList.add('is-open');
    stockGateError.textContent = '';
    stockGatePassword.value = '';
    stockGatePassword.classList.remove('is-error');
    if (stockGateBox) stockGateBox.classList.remove('is-error');
    setTimeout(function () { stockGatePassword.focus(); }, 50);
  }

  function closeStockGate() {
    if (!stockGate) return;
    stockGate.classList.remove('is-open');
  }

  var ALL_VIEWS = ['siteView', 'stockView', 'brandView'];

  function showView(viewId) {
    ALL_VIEWS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('page-hidden', id !== viewId);
    });
    window.scrollTo(0, 0);
  }

  function showStockView() {
    showView('stockView');
  }

  function showSiteView() {
    showView('siteView');
  }

  var backToSite = document.getElementById('backToSite');
  if (backToSite) {
    backToSite.addEventListener('click', showSiteView);
  }

  if (stockLink && stockGate) {
    stockLink.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      navbar.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      openStockGate();
      return false;
    });

    stockGateCancel.addEventListener('click', closeStockGate);

    stockGate.addEventListener('click', function (e) {
      if (e.target === stockGate) closeStockGate();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeStockGate();
    });

    stockGateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (stockGatePassword.value === STOCK_PASSWORD) {
        closeStockGate();
        showStockView();
      } else {
        stockGateError.textContent = '❌ Senha incorreta. Tente novamente.';
        stockGateBox.classList.add('is-error');
        stockGatePassword.classList.add('is-error');
        stockGatePassword.value = '';
        stockGatePassword.focus();
        setTimeout(function () {
          stockGateBox.classList.remove('is-error');
          stockGatePassword.classList.remove('is-error');
        }, 400);
      }
    });
  }

  /* ---------- Envio do formulário de contato (feedback local) ---------- */
  var contactForm = document.getElementById('contactForm');
  var formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formFeedback) {
        formFeedback.textContent = 'Mensagem enviada! Em breve nossa equipe entra em contato. 📱';
      }
      contactForm.reset();
      setTimeout(function () {
        if (formFeedback) formFeedback.textContent = '';
      }, 5000);
    });
  }

  /* ---------- Painel de Estoque (embutido na mesma página) ---------- */
  var STOCK_STORAGE_KEY = 'imagic_estoque';

  function parseCurrencyBR(str) {
    if (typeof str !== 'string') return NaN;
    str = str.trim().replace(/[^\d.,-]/g, '');
    if (!str) return NaN;

    var hasComma = str.indexOf(',') !== -1;
    var hasDot = str.indexOf('.') !== -1;

    if (hasComma && hasDot) {
      // Ponto = separador de milhar, vírgula = decimal (ex: 4.200,50)
      str = str.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
      // Só vírgula presente = decimal (ex: 4200,50)
      str = str.replace(',', '.');
    } else if (hasDot) {
      // Só ponto presente: pode ser milhar (4.200) ou decimal (4.20).
      var dotParts = str.split('.');
      var lastPart = dotParts[dotParts.length - 1];
      if (dotParts.length > 2 || lastPart.length === 3) {
        // Múltiplos pontos ou exatamente 3 dígitos após o último = separador de milhar
        str = dotParts.join('');
      }
      // Caso contrário (1 ou 2 dígitos após o ponto), trata como decimal normalmente
    }

    return parseFloat(str);
  }

  var seedProducts = [
    { id: 'p1', nome: 'iPhone 17 Pro Max 256GB', custo: 7200, venda: 9499, atualizadoEm: new Date().toISOString() },
    { id: 'p2', nome: 'iPhone 17 128GB', custo: 5100, venda: 6799, atualizadoEm: new Date().toISOString() },
    { id: 'p3', nome: 'iPhone 16 128GB', custo: 3900, venda: 5299, atualizadoEm: new Date().toISOString() }
  ];

  function loadProducts() {
    try {
      var raw = localStorage.getItem(STOCK_STORAGE_KEY);
      if (!raw) {
        saveProducts(seedProducts);
        return seedProducts.slice();
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Erro ao ler estoque salvo:', err);
      return [];
    }
  }

  function saveProducts(list) {
    try {
      localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Erro ao salvar estoque:', err);
    }
  }

  var stockForm = document.getElementById('stockForm');

  if (stockForm) {
    var products = loadProducts();
    var stockNomeInput = document.getElementById('fieldNome');
    var stockCustoInput = document.getElementById('fieldCusto');
    var stockVendaInput = document.getElementById('fieldVenda');
    var stockTbody = document.getElementById('stockTableBody');
    var stockEmptyMsg = document.getElementById('stockEmpty');
    var stockSummaryTotal = document.getElementById('summaryTotal');
    var stockSummaryValue = document.getElementById('summaryValue');
    var stockSearchInput = document.getElementById('stockSearch');
    var stockSearchTerm = '';

    function formatBRL(value) {
      var num = Number(value) || 0;
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDate(iso) {
      var date = new Date(iso);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function updateStockSummary() {
      var totalValue = 0;
      products.forEach(function (p) { totalValue += Number(p.venda); });
      stockSummaryTotal.textContent = products.length;
      stockSummaryValue.textContent = formatBRL(totalValue);
    }

    function renderStock() {
      stockTbody.innerHTML = '';
      updateStockSummary();

      var visible = stockSearchTerm
        ? products.filter(function (p) { return p.nome.toLowerCase().indexOf(stockSearchTerm) !== -1; })
        : products;

      if (!products.length) {
        stockEmptyMsg.textContent = 'Nenhum produto cadastrado ainda. Adicione o primeiro produto acima.';
        stockEmptyMsg.style.display = 'block';
        return;
      }

      if (!visible.length) {
        stockEmptyMsg.textContent = 'Nenhum aparelho encontrado para "' + stockSearchInput.value + '".';
        stockEmptyMsg.style.display = 'block';
        return;
      }

      stockEmptyMsg.style.display = 'none';

      visible.forEach(function (product) {
        var margin = Number(product.venda) - Number(product.custo);
        var marginClass = margin >= 0 ? 'margin-positive' : 'margin-negative';

        var tr = document.createElement('tr');
        tr.dataset.id = product.id;
        tr.innerHTML =
          '<td><input class="editable" type="text" value="' + escapeHtml(product.nome) + '" data-field="nome"></td>' +
          '<td><input class="editable" type="text" inputmode="decimal" value="' + Number(product.custo).toFixed(2).replace('.', ',') + '" data-field="custo"></td>' +
          '<td><input class="editable" type="text" inputmode="decimal" value="' + Number(product.venda).toFixed(2).replace('.', ',') + '" data-field="venda"></td>' +
          '<td class="' + marginClass + '">' + formatBRL(margin) + '</td>' +
          '<td class="stock-updated">' + formatDate(product.atualizadoEm) + '</td>' +
          '<td class="stock-actions">' +
            '<button type="button" class="btn-save">Salvar</button>' +
            '<button type="button" class="btn-delete">Remover</button>' +
          '</td>';
        stockTbody.appendChild(tr);
      });
    }

    stockForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = stockNomeInput.value.trim();
      var custo = parseCurrencyBR(stockCustoInput.value);
      var venda = parseCurrencyBR(stockVendaInput.value);
      if (!nome || isNaN(custo) || isNaN(venda)) {
        alert('Preencha nome, custo e valor de venda corretamente. Use vírgula ou ponto para centavos (ex: 1500,00).');
        return;
      }

      products.push({
        id: 'p' + Date.now(),
        nome: nome,
        custo: custo,
        venda: venda,
        atualizadoEm: new Date().toISOString()
      });

      saveProducts(products);
      renderStock();
      stockForm.reset();
      stockNomeInput.focus();
    });

    stockTbody.addEventListener('click', function (e) {
      var target = e.target;
      var row = target.closest('tr');
      if (!row) return;
      var id = row.dataset.id;
      var index = products.findIndex(function (p) { return p.id === id; });
      if (index === -1) return;

      if (target.classList.contains('btn-save')) {
        var novoNome = row.querySelector('[data-field="nome"]').value.trim();
        var novoCusto = parseCurrencyBR(row.querySelector('[data-field="custo"]').value);
        var novaVenda = parseCurrencyBR(row.querySelector('[data-field="venda"]').value);

        if (!novoNome || isNaN(novoCusto) || isNaN(novaVenda)) {
          alert('Preencha nome, custo e valor de venda corretamente antes de salvar.');
          return;
        }

        products[index].nome = novoNome;
        products[index].custo = novoCusto;
        products[index].venda = novaVenda;
        products[index].atualizadoEm = new Date().toISOString();

        saveProducts(products);
        renderStock();
      }

      if (target.classList.contains('btn-delete')) {
        if (confirm('Remover "' + products[index].nome + '" do estoque?')) {
          products.splice(index, 1);
          saveProducts(products);
          renderStock();
        }
      }
    });

    if (stockSearchInput) {
      stockSearchInput.addEventListener('input', function () {
        stockSearchTerm = stockSearchInput.value.trim().toLowerCase();
        renderStock();
      });
    }

    renderStock();
  }
});
