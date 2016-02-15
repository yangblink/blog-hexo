Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// 渲染订单详情源数据
var didi_orders_data = {
    orders: []
};


// 日期控件
$('.datepicker').datepicker({
    language: 'zh-CN',
    multidate: true,

}).on('hide' ,datepickerDone);

function datepickerDone(e) {
    console.log(e);

    var picker_dates = e.dates,
        total_orders = picker_dates.length,
        final_dates = [],
        // 你应该不会下班后就马上走吧
        // 下班后墨迹起始时间 minutes
        moji_time = 10,
        // 下班后墨迹时间范围
        range = 30;

    didi_orders_data.orders = [];
    picker_dates.forEach(function(item, index){
        item.setHours(21);
        item.setMinutes( getRandomNumFromRange(moji_time, moji_time + range) );
        final_dates[index] = item.Format("MM月dd日 hh:mm");

        didi_orders_data.orders[index] = {};
        didi_orders_data.orders[index].time = final_dates[index];
    })

    console.log(final_dates);
}
// 


// 添加 删除 优惠信息表单
$('.overview').on('click', '.del-order-detail', function(e){
    var $elem = $(this),
        cur = e.target.parentNode;

    while(cur.className !== 'order-detail-group'){
        cur = cur.parentNode;
        if('order-detail-group' === cur.className && cur.childElementCount > 1){
            $(this.parentNode).remove()
        }
    }
    e.preventDefault();
})
$('.overview').on('click', '.add-order-detail', function(e){
    var $elem = $(this),
        cur = e.target.parentNode;
    while(cur.className !== 'order-detail-group'){
        cur = cur.parentNode;
        if('order-detail-group' === cur.className){
            $(cur).append(
                    '<div class="line">'+
                        '<input type="text" class="form-control order-title" placeholder="微信免密 7折抵扣券 ..."> '+
                        '<input type="text" class="form-control order-num" placeholder="¥"> '+
                        '<button class="btn btn-primary btn-sm del-order-detail">删除</button> '+
                        '<button class="btn btn-primary btn-sm add-order-detail">添加</button>'+
                    '</div>'
                )
        }
    }
});

// var travel = template('didi_main', datas);
// document.getElementById('table_wrap').innerHTML = travel;


// 生成表单列表
$('#generate').on('click', generateList);
// 生成报销表单
$('.overview').on('click', '#generate_table', generateOrderList);

function generateList(e) {
    var t = document.getElementById('mytimes'),
        s = document.getElementById('mystart'),
        e = document.getElementById('myend');

    if(t.validity.valid && s.validity.valid && e.validity.valid){
    // if(true){

        var art_didi_orders = template('didi_orders', didi_orders_data);
        document.getElementById('generate_order').innerHTML = art_didi_orders;
    }
    else {
        alert('请完善信息！');
    }
    // e.preventDefault();

}

function generateOrderList(e) {
    var datas = {orders:[]},
        orders = datas.orders,
        $elems = $('.order-generate-detail'),
        len = $elems.length;

    for (var i = 0; i < len; i++) {
        var elem = $elems[i];

        orders[i] = {};
        // orders[i].date = didi_orders_data.orders[i].time;
        orders[i].date = $(elem).find('.order-time').val();
        orders[i].category = "快车";
        orders[i].status = "已完成";
        orders[i].start_place = document.getElementById('mystart').value;
        orders[i].end_place = document.getElementById('myend').value;
        var dirver = orders[i].dirver = {};
        dirver.name = getRandomSurname();
        dirver.plate_num = getRandomPlateNum();
        dirver.brand = getRandomBrand();
        dirver.stars = "5.0",
        dirver.orders = getRandomOrders();
        var pay = orders[i].pay = {};
                pay.total = $(elem).find('.order-total').val();
        var lines = $(elem).find('.line'),
            details = [];
        for(var j = 0; j < lines.length; j++){
            details[j] = {};
            details[j].title = $(lines[j]).find('.order-title').val();
            details[j].num = $(lines[j]).find('.order-num').val();
        }
        pay.pay_details  = details;

    }
    var travel = template('didi_main', datas);
    document.getElementById('table_wrap').innerHTML = travel;


}

$('#dachebaoxiao_title').on('click', function(e){
    $('.overview').toggle();
    $('#hide_title').toggle();
})










// 姓氏列表
var surnames = [
    "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "楮", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许", "何", "吕", "施", "张", "孔", "曹", "严", "华"
];
var car_brands = [
    '白色 · 现代索纳塔9',
    '现代悦动',
    '现代IX35',
    '北汽新能源ES210',
    '别克君悦',
    '银色 · 别克GL8',
    '吉利帝豪',
    '日产骐达'
];

function randomIndex(len) {
    return Math.floor(Math.random() * len );
}

// 获取随机姓氏
function getRandomSurname() {
    return surnames[ randomIndex(surnames.length) ];
}
// 获取随机车牌号
function getRandomPlateNum() {
    return new RandExp(/[\dA-Z]{2}[\d]{2}$/).gen();
}
// 随机获取车子类型
function getRandomBrand() {
    return car_brands[ randomIndex(car_brands.length) ];
}
// 获取随机订单数
function getRandomOrders() {
    return randomIndex(2000) + 500;
}
// 获取指定正整数之间的随机数 
function getRandomNumFromRange(start, end){

    if (end === undefined || start >= end) {
        return start;
    }
    var range = end - start + 1;
    return Math.floor(Math.random() * range) + start;
}











