$(document).ready(function () {
  $("nav").hover(
    function () {
      $("nav").css({ background: "white" });
    },
    function () {
      $("nav").css({ background: "transparent" });
    }
  );

  $(".depth1, .depth").hover(
    function () {
      $(this).css({ background: "#fdd000" });
      $(this).parents("li").css({ background: "#fdd000" });
      $(".sub-shadow").addClass("active");
      $(".container nav > ul > li > ul").css({ height: "150px" });
      $(".container nav > ul").addClass("active");
      $(".container nav > ul > li > a:after").css({ width: "50rem" });
    },
    function () {
      $(".sub-shadow").removeClass("active");
      $(".container nav > ul > li > ul").css({ height: "0px" });
      $(".container nav > ul").removeClass("active");
      $(this).css({ background: "transparent" });
      $(this).parents("li").css({ background: "transparent" });
    }
  );

  var isSideMenuOpen = false; // 사이드 메뉴가 열려있는지 여부를 나타내는 플래그

  $(".openBtn").click(function () {
    $(".side_wrap").stop().animate({ left: 0 }, 500);
    isSideMenuOpen = true;
  });

  $(".closeBtn").click(function () {
    $(".side_wrap").stop().animate({ left: "100%" }, 500);
    isSideMenuOpen = false;
  });

  // 스크롤 이벤트 핸들러
  $(window).on("scroll", function () {
    if (isSideMenuOpen) {
      return false; // 사이드 메뉴가 열려있을 때는 스크롤 이벤트 동작하지 않도록 false를 반환
    }
  });

  var swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // 초기에 첫 번째 메뉴 항목에 강조 효과를 추가하고 "-"을 추가합니다.
  $(".left_menu ul li:first-child a").addClass("active").prepend("- ");

  $(".left_menu ul li a").click(function () {
    // 모든 메뉴 항목의 강조 효과를 제거합니다.
    $(".left_menu ul li a").removeClass("active");

    // 클릭한 메뉴 항목에 강조 효과를 추가합니다.
    $(this).addClass("active");

    // "-"을 추가하는 부분입니다.
    $(".left_menu ul li a").each(function () {
      var menuText = $(this).text();

      // "-"을 추가할 조건을 검사합니다.
      if ($(this).hasClass("active") && !menuText.startsWith("-")) {
        $(this).prepend("- ");
      } else if (!$(this).hasClass("active") && menuText.startsWith("-")) {
        $(this).text(menuText.substring(2));
      }
    });
  });

  // 세로 스크롤 이벤트 처리
  var scrollFlag = false; // 스크롤 동작 여부를 나타내는 플래그
  var scrollTimeout = null; // 스크롤 타임아웃
  var scrollDistance = $(window).height(); // 이동할 거리를 현재 창의 높이로 설정
  var currentPosition = 0; // 현재 위치

  $(window).on("scroll", function () {
    if (!scrollFlag) {
      scrollFlag = true;

      clearTimeout(scrollTimeout); // 기존의 스크롤 타임아웃을 제거합니다.

      scrollTimeout = setTimeout(function () {
        scrollFlag = false;
      }, 1000); // 1초 동안 스크롤 동작을 막습니다.

      var scrollPos = $(window).scrollTop();

      if (scrollPos > currentPosition) {
        scrollToNextSection();
      } else if (scrollPos < currentPosition) {
        scrollToPreviousSection();
      }

      currentPosition = scrollPos;
    }
  });

  var isAnimating = false; // 애니메이션 진행 여부를 나타내는 플래그

  function scrollToNextSection() {
    if (isAnimating) return; // 애니메이션이 진행 중인 경우, 무시합니다.

    var scrollPos = $(window).scrollTop();
    var nextSectionTop = Math.ceil(scrollPos / scrollDistance) * scrollDistance;

    isAnimating = true; // 애니메이션 시작

    $("html, body").animate({ scrollTop: nextSectionTop }, 500, function () {
      isAnimating = false; // 애니메이션 종료 후 플래그를 false로 설정
      currentPosition = nextSectionTop; // 현재 위치를 다음 섹션의 위치로 업데이트

      updateActiveMenuItem();
    });
  }

  function scrollToPreviousSection() {
    if (isAnimating) return; // 애니메이션이 진행 중인 경우, 무시합니다.

    var scrollPos = $(window).scrollTop();
    var previousSectionTop = Math.floor(scrollPos / scrollDistance) * scrollDistance;

    isAnimating = true; // 애니메이션 시작

    $("html, body").animate({ scrollTop: previousSectionTop }, 500, function () {
      isAnimating = false; // 애니메이션 종료 후 플래그를 false로 설정
      currentPosition = previousSectionTop; // 현재 위치를 이전 섹션의 위치로 업데이트

      updateActiveMenuItem();
    });
  }

  function updateActiveMenuItem() {
    var scrollPos = $(window).scrollTop();

    $(".left_menu ul li a").each(function () {
      var target = $(this.hash);

      if (target.length) {
        var sectionTop = target.offset().top;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + target.outerHeight()) {
          $(".left_menu ul li a").removeClass("active");
          $(this).addClass("active");

          $(".left_menu ul li a").each(function () {
            var menuText = $(this).text();

            if ($(this).hasClass("active") && !menuText.startsWith("-")) {
              $(this).prepend("- ");
            } else if (!$(this).hasClass("active") && menuText.startsWith("-")) {
              $(this).text(menuText.substring(2));
            }
          });
        }
      }
    });
  }

  var $window = $(window);
  var $fixedMenu = $(".fixed-menu");
  var previousPosition = 0; // 이전 위치 저장 변수

  // 스크롤 이벤트 처리
  $window.on("scroll", function () {
    var scrollTop = $window.scrollTop();

    if (scrollTop >= previousPosition) {
      $fixedMenu.addClass("active");
    } else {
      $fixedMenu.removeClass("active");
    }

    previousPosition = scrollTop;

    updateActiveMenuItem();
  });

  $("a[href^='#']").click(function () {
    if (isAnimating) return; // 애니메이션이 진행 중인 경우, 무시합니다.

    var target = $(this.hash);

    if (target.length) {
      isAnimating = true; // 애니메이션 시작

      $("html, body").animate({ scrollTop: target.offset().top }, 500, function () {
        isAnimating = false; // 애니메이션 종료 후 플래그를 false로 설정
        currentPosition = target.offset().top; // 현재 위치를 대상 섹션의 위치로 업데이트

        updateActiveMenuItem();
      });

      return false;
    }
  });
});
$(document).ready(function () {
  function adjustImageURL() {
    var windowWidth = $(window).width();

    // 클래스 이름과 이미지 URL을 매핑하는 객체 생성
    var imageMap = {
      img1: windowWidth <= 760 ? "./img/BG_main_m.jpg" : "./img/BG-main.jpg",
      img2: windowWidth <= 760 ? "./img/BG_m1.jpg" : "./img/BG_swiper1.jpg",
      img3: windowWidth <= 760 ? "./img/BG_m2.jpg" : "./img/BG_swiper2.jpg",
      img4: windowWidth <= 760 ? "./img/BG_m3.jpg" : "./img/BG_swiper3.jpg",
      img5: windowWidth <= 760 ? "./img/BG_m4.jpg" : "./img/BG_swiper4.jpg",
      img6: windowWidth <= 760 ? "./img/BG_m5.jpg" : "./img/BG_swiper5.jpg",
      img7: windowWidth <= 760 ? "./img/BG_m6.jpg" : "./img/BG_swiper6.jpg",
      img8: windowWidth <= 760 ? "./img/BG_m7.jpg" : "./img/BG_swiper7.jpg",
      // 나머지 이미지들도 동일한 방식으로 추가
    };

    // 각 이미지 슬라이드에 대해 URL을 설정합니다.
    for (var className in imageMap) {
      if (imageMap.hasOwnProperty(className)) {
        var imageUrl = imageMap[className];
        $("." + className + " img").attr("src", imageUrl);
      }
    }
  }

  adjustImageURL();

  $(window).resize(function () {
    adjustImageURL();
  });
});
