function validate() {
  let user = document.getElementById('user').value;
  let regex = /^ASPIRANTE\d{4}$/;

  if (!regex.test(user)) {
    console.log("Ta mal");
  } else {
    console.log("Ta bien");
  }
}