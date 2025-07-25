// Form section JS 
window.addEventListener('load' , () => {
    const params = (new URL(document.location)).searchParams;
    const nprop = params.get('name');
    if (nprop != ''){
      document.getElementById('prop').value = nprop;
    }
  })

// For Local Use 
// function frmsbm(){
//   num_val = document.getElementById('num').value
//   if (document.getElementById('email').value.includes('@')){
//     if (document.getElementById('email').value.includes('.')){
//       if (num_val.length == 10){
//         if(num_val.slice(0, 1) >= 7 && num_val.slice(0, 1) <=9 ){
//           if(isNaN(num_val)){
//             alert('Mobile Number is incorrect');
//           }
//           else{
//             document.getElementById('subm').style['display'] = 'block';
//             document.getElementById('frm').style['display'] = 'none';
//           }
//         }
//         else{
//           alert('Mobile Number is incorrect');
//         }
//       }
//       else{
//         alert('Mobile Number is incorrect');
//       }
//     }
//     else{
//       alert('Email Address is incorrect');
//     }
//       }
//       else{
//         alert('Email Address is incorrect');
//       }
//   }


// Frequently Asked Questions Activity
function toggleFAQ(id, element) {
  var answer = document.getElementById(id);
  var icon = element.querySelector(".faq-icon");
  
  if (answer.style.display === "block") {
      answer.style.display = "none";
      icon.textContent = "+";
  } else {
      document.querySelectorAll(".faq-answer").forEach(el => el.style.display = "none");
      document.querySelectorAll(".faq-icon").forEach(el => el.textContent = "+");
      answer.style.display = "block";
      icon.textContent = "−";
  }
}