
var ero = document.getElementById("ero");
var click = document.getElementById("click");
var back = document.getElementById("back");

function checkInternet() {
  if (!navigator.onLine) {
    ero.currentTime = 0;
  ero.play();
    Swal.fire({
      title: 'No Internet Connection',
      text: 'Please check your network connection.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Retry',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        click.currentTime = 0;
        click.play();
        setTimeout(() => {
        
        // Dib u hubi
        checkInternet();
      },300);
      } else {
        back.play();
        // Xir page-ka
        window.close();
      }
    });
  } else {
    console.log("You are online.");
  }
}

// Baar marka page-ku furmo
checkInternet();

// Dhageyso haddii internet-ka go'o intaad isticmaaleyso
window.addEventListener('offline', checkInternet);
