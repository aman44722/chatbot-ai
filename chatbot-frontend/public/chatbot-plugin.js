(function () {
  var t = document.createElement("iframe");
  t.src = "http://localhost:3000/embed"; // 👈 yaha pe wahi route
  t.style.position = "fixed";
  t.style.bottom = "20px";
  t.style.right = "20px";
  t.style.width = "370px";
  t.style.height = "500px";
  t.style.border = "none";
  t.style.zIndex = "999999";
  document.body.appendChild(t);
})();
