// const inputCash = prompt("당신의 지갑에 현금이 얼마나있나요?");

const cashStr = document.getElementById("cash");
const inpDeposit = document.getElementById("inpDeposit");
const btnDeposit = document.getElementById("btnDeposit");
const btnRefund = document.getElementById("btnRefund");
const balanceStr = document.getElementById("balance");
const totalAmo = document.getElementById("totalAmount");
const btnCola = Array.from(document.getElementsByClassName("cola__btn"));

function AmountCommas(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//입금액 읽어오기
let cash = +rmComma(cashStr.innerText);

//콤마 제거
function rmComma(str) {
  str = String(str);
  return str.replace(/[^\d]+/g, "");
}
//콤마 추가
function addComma(num) {
  num = String(num);
  return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
}

console.log(btnCola[0].disabled);
//콜라 아이템 버튼 활성화

function doEnabled() {
  btnCola.forEach((item) => {
    if (sumDeposit >= 1000) {
      item.classList.add("enabled");
      item.disabled = false;
      console.log(btnCola[0].disabled);
    } else {
      item.classList.remove("enabled");
      item.disabled = true;
    }
  });
}

//입금기능
let sumDeposit = 0;

function doDeposit() {
  //방지: 소지금 초과, 문자입력 알림창, 마이너스 금액 입력
  if (+inpDeposit.value > cash) {
    inpDeposit.value = "";
    return alert("소지금을 초과하였습니다.");
  } else if (isNaN(inpDeposit.value)) {
    inpDeposit.value = "";
    return alert("숫자를 입력하세요.");
  } else if (+inpDeposit.value < 0) {
    inpDeposit.value = "";
    return alert("마이너스로 시작하는 금액은 없습니다.");
  }

  //입금액 반영
  sumDeposit += +inpDeposit.value;
  cash -= +inpDeposit.value;

  doEnabled();

  //출력: 입금액
  balanceStr.innerText = `${addComma(sumDeposit)}원`;
  //출력: 소지금
  cashStr.innerText = `${addComma(cash)}원`;
  //입력창 리셋
  inpDeposit.value = "";
}

btnDeposit.addEventListener("click", function () {
  doDeposit();
  console.log("입금버튼 확인");
});
