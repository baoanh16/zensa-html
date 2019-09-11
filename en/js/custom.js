$(document).on("click", ".video-display video", function(e) {
  var video = $(this).get(0);
  if (video.paused === false) {
    video.pause();
    $(this)
      .parent()
      .find(".play__icon")
      .fadeIn();
  } else {
    video.play();
    $(this)
      .parent()
      .find(".play__icon")
      .fadeOut();
  }
  return false;
});
$(document).ready(function() {
  swiperInit();
});

function swiperInit() {
  var mySwiper = new Swiper(".comment-wrapper .swiper-container", {
    loop: true,
    slidesPerView: 1,
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });
}
