//axios部份
const api = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
//重新塞入innerHTML的ul部份
const elTicketCardArea = document.querySelector('.ticketCard-area');
//console.log(axios); 驗證是否有讀取到axios.js
//addTicketCard部分
const eladdTicketForm = document.querySelector('.addTicket-form');
const elTicketName = document.querySelector('#ticketName');
const elTicketImgUrl = document.querySelector('#ticketImgUrl');
const elTicketRegion = document.querySelector('#ticketRegion');
const elTicketPrice = document.querySelector('#ticketPrice');
const elTicketNum = document.querySelector('#ticketNum');
const elTicketRate = document.querySelector('#ticketRate');
const elTicketDescription = document.querySelector('#ticketDescription');
const elAddTicketBtn = document.querySelector('.addTicket-btn');
//搜尋筆數部份
const elRegionSearch = document.querySelector('.regionSearch');
const elSearchResultText = document.querySelector('#searchResult-text');

let myData = [];//宣告主要陣列資料空陣列
//初始化函式抓api的data帶進myData部份
function init() {

  axios.get(api)
    .then((res) => {
      //console.log(res.data.data); //驗證是否回傳
      myData = res.data.data;
      //console.log(myData); //驗證是否回傳
      render(myData)
      renderC3(myData)
    });
}
//渲染套票部份
function render(myData) {
  let str = '';
  myData.forEach((item) => {
    str += `<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${item.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">10</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>`
  })
  elTicketCardArea.innerHTML = str;//elTicketCardArea塞入組合字串
};
//新增套票部份
elAddTicketBtn.addEventListener('click', function (e) {
  e.preventDefault();//取消預設動作
  if (
    elTicketName.value !== "" &&//套票名稱
    elTicketImgUrl.value !== "" &&//圖片網址
    elTicketRegion.value !== "" &&//景點地區
    elTicketDescription.value !== "" &&//景點描述
    parseInt(elTicketRate.value) > 0 &&//型別數字//推薦星級
    parseInt(elTicketRate.value) <= 10 &&//型別數字//推薦星級
    parseInt(elTicketNum.value) > 0 &&//型別數字//剩餘數量
    parseInt(elTicketPrice.value) > 0 &&//型別數字//套票價錢
    elTicketDescription.value.length <= 100//景點描述字數
  ) {
    myData.push({//新增物件進myData陣列後方
      id: Date.now(),
      name: elTicketName.value,
      imgUrl: elTicketImgUrl.value,
      area: elTicketRegion.value,
      description: elTicketDescription.value,
      group: parseInt(elTicketNum.value),
      price: parseInt(elTicketPrice.value),
      rate: parseInt(elTicketRate.value),
    });
    render(myData);//執行渲染套票重帶一次myData
    eladdTicketForm.reset();//新增完畢form就reset清空
  } else if (parseInt(elTicketPrice.value) < 0) {
    alert('價錢請大於0');//跳出警告窗
  } else if (parseInt(elTicketNum.value) <= 0) {
    alert('剩餘組數不可輸入小於0');//跳出警告窗
  } else if (parseInt(elTicketRate.value) <= 1 || parseInt(elTicketRate.value) > 10) {
    alert('推薦星級區間是 1-10 星');//跳出警告窗
  } else if (elTicketDescription.value.length > 100) {
    alert('不可超過100字');//跳出警告窗
  } else {
    alert('所有欄位必填');//跳出警告窗
  }
});
//搜尋筆數部份
elRegionSearch.addEventListener('change', function (e) {//elRegionSearch如果change就執行
  e.preventDefault();//取消預設動作
  let filterAry = [];//宣告空陣列
  if (elRegionSearch.value !== '') {//如果elRegionSearch.value不等於空字串
    filterAry = myData.filter((item) => item.area === elRegionSearch.value);//myData的area等於elRegionSearch.value時,另組成filterAry陣列
    render(filterAry);//重新渲染帶入參數
    //console.log(filterAry);
    renderC3(filterAry);//重新渲染帶入參數
    //myDataLength = filterAry.length//搜尋'全部地區'部份才不會出錯,因為沒有一個地區叫'全部地區'
    elSearchResultText.textContent = `本次搜尋共 ${filterAry.length} 筆資料`;//執行elSearchResultText文字替換
  } else {
    render(myData);//重新渲染帶入參數
    renderC3(myData)//重新渲染帶入參數
    elSearchResultText.textContent = `本次搜尋共 ${myData.length} 筆資料`;//執行elSearchResultText文字替換
  }

})


init()//執行初始化函式

function renderC3(myData) {//利用搜尋筆數部份下拉選單change時,就重新渲染
  let totalObj = {};
  myData.forEach((item, index) => {
    if (totalObj[item.area] === undefined) {//物件totalObj的屬性area為undefined時
      totalObj[item.area] = 1;//物件totalObj的屬性area=1
    } else {
      totalObj[item.area] += 1;//物件totalObj的屬性area+1(計算同組數量)
    }
    //console.log(totalObj);
  })

  let newData = [];//做成c3 donut格式 [[]] 陣列包陣列
  let areaNum = Object.keys(totalObj);//撈出key(物件屬性)做成陣列 才能跑forEach
  areaNum.forEach((item, index) => {//areaNum陣列跑forEach
    let ary = [];//做成c3 donut格式 [[]] 陣列包陣列
    ary.push(item);
    ary.push(totalObj[item]);
    newData.push(ary);
    console.log(newData);
  })

  let chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: newData,
      type: 'donut',
    },
    donut: {
      title: "套票地區比重"
    }
  });


}





