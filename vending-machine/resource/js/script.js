// const inputCash = prompt("당신의 지갑에 현금이 얼마나있나요?");

const cashStr = document.getElementById("cash");
const inpDeposit = document.getElementById("inpDeposit");
const btnDeposit = document.getElementById("btnDeposit");
const btnRefund = document.getElementById("btnRefund");
const balanceStr = document.getElementById("balance");
const totalAmo = document.getElementById("totalAmount");
const btnCola = Array.from(document.getElementsByClassName("cola__btn"));
const colaList = document.getElementById("colaList");
const btnOrder = document.getElementById("btnOrder");

function AmountCommas(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//변수 : 소지금 콤마제거해서 가져오기
let cash = +rmComma(cashStr.innerText);

//변수 : 입금액
let sumDeposit = 0;

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

//기능 : 화면에 입금액, 소지금 출력
function doPrint() {
  balanceStr.innerText = `${addComma(sumDeposit)}원`;
  cashStr.innerText = `${addComma(cash)}원`;
  inpDeposit.value = "";
}

//기능 : 콜라 아이템 버튼 활성화
function doEnabled() {
  btnCola.forEach((item) => {
    if (sumDeposit >= 1000) {
      item.classList.add("enabled");
      item.disabled = false;
      //품절 상품 활성화 방지
      if (item.classList.contains("soldout")) {
        item.classList.remove("enabled");
        item.disabled = true;
      }
    } else {
      item.classList.remove("enabled");
      item.disabled = true;
    }
  });
}

//기능 : 입금

function doDeposit() {
  //방지: 소지금 초과, 문자입력 알림창, 마이너스 금액 입력, 0원 혹은 미입력
  if (+inpDeposit.value > cash) {
    return alert("소지금을 초과하였습니다.");
  } else if (isNaN(inpDeposit.value)) {
    return alert("숫자를 입력하세요.");
  } else if (+inpDeposit.value < 0) {
    return alert("마이너스로 시작하는 금액은 없습니다.");
  } else if (inpDeposit.value == 0) {
    return alert("값을 입력하세요");
  }

  //입금액 반영
  sumDeposit += +inpDeposit.value;
  cash -= +inpDeposit.value;

  doEnabled();
  doPrint();
}

//이벤트 : 입금 버튼
btnDeposit.addEventListener("click", function () {
  doDeposit();
  inpDeposit.value = "";
});

//이벤트 : 환불 버튼
btnRefund.addEventListener("click", function () {
  cash += sumDeposit;
  sumDeposit = 0;
  cashStr.innerText = `${addComma(cash)}원`;
  balanceStr.innerText = `0원`;
  doEnabled();
  doPrint();
});

colaList.addEventListener("click", doSelect);

// 기능 : 콜라 아이템 선택
function doSelect(event) {
  if (!event.target.classList.contains("cola__btn")) return;
  let e = event.target.dataset;
  e.count > 0 ? (e.count -= 1) : (e.count = 0);
  sumDeposit -= +e.price;
  console.log(`e.key ${e.key}`);
  doPrint();
  doEnabled();
  doSoldout(event.target);
  doCart(e.item, e.src, e.key);
}

// 기능 : 품절
function doSoldout(item) {
  if (item.dataset.count == "0") {
    item.classList.remove("enabled");
    item.classList.add("soldout");
    item.disabled = true;
  }
}
const stagedList = document.getElementById("stagedList");

const stagedData = {
  OriginalCola: 0,
  OrangeCola: 0,
  VioletCola: 0,
  YellowCola: 0,
  GreenCola: 0,
};

function doCart(item, src, key) {
  if (stagedData[key] !== 0) {
    stagedData[key] += 1;
    console.log(`${key}는 이미 장바구니에 있는 상품입니다."`);
    console.log(`${key}를 ${stagedData[key]}개 담았습니다.`);
    let quantity = document.getElementById(`${key}-staged`);
    quantity.innerText = stagedData[key];
  } else {
    stagedData[key] += 1;
    console.log(`최초로 ${key}를 장바구니에 담았습니다.`);
    console.log(`${key}를 ${stagedData[key]}개 담았습니다.`);
    let li = document.createElement("li");
    li.className = "order-list__item staged";
    let div = document.createElement("div");
    div.className = "order-item";
    let img = document.createElement("img");
    img.className = "order-item__img";
    img.setAttribute("src", `${src}`);
    let span = document.createElement("span");
    span.className = "order-item__tit";
    span.append(`${item}`);
    let strong = document.createElement("strong");
    strong.className = "order-item__number";
    strong.id = `${key}-staged`;
    strong.append(stagedData[key]);
    div.append(img, span);
    li.append(div, strong);
    stagedList.append(li);
  }
}

const resultList = document.getElementById("resultList");

function doOrder() {
  let itemList = Array.from(document.getElementsByClassName("staged"));
  resultList.append(...itemList);
}

function resetStaged() {
  for (let i of stagedData) {
    stagedData[i] = 0;
  }
}

btnOrder.addEventListener("click", doOrder);
