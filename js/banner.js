// Interior-page header banner: drop one random clip from the pool behind the
// WCPW wordmark. A fresh scene on every page load, matching the landing page.
// To add or remove a scene, edit this list (a static site can't read videos/).
(function () {
  var VIDEOS = [
    "scene-1.mp4",
    "scene-2.mp4",
    "scene-3.mp4",
    "scene-4.mp4",
    "scene-5.mp4",
    "scene-6.mp4",
    "scene-7.mp4",
    "scene-8.mp4"
  ];

  var video = document.querySelector(".site-banner .banner-video");
  if (!video) return;

  var file = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
  var source = document.createElement("source");
  source.src = "videos/" + file;
  source.type = "video/mp4";
  video.appendChild(source);
  video.load();

  var playing = video.play();
  if (playing && playing.catch) playing.catch(function () {});
})();
