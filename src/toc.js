import $ from "jquery";
let toc = {
    select: ["h1, h2, h3, h4, h5, h6"]
}
export default {
    mounted(){
        console.info("[mangodoc-toc] mounted");
        $("#toc").remove();
        $("#toc-oper").remove();
        if(window.$mangodoc.toc){
            toc = window.$mangodoc.toc;
        }
        // 获取所有标题元素
        var headings = document.querySelectorAll('#app '+ toc.select);
        // 创建一个新的<ul>元素，用于存储TOC
        var tocList = document.createElement('ul');
        tocList.id = "toc";
        let index = 0;
        // 遍历所有标题元素，为每个标题创建一个锚点链接和TOC条目
        headings.forEach(function(heading) {
          index = index + 1;
          // 获取标题文本和标签名
          var headingText = heading.innerText;
          var headingTagName = heading.tagName.toLowerCase();
          heading.id = "heading"+index;
          // 创建一个新的锚点链接
          var anchorLink = document.createElement('a');
          anchorLink.setAttribute('href', window.location.hash.split("?")[0] + '?id=' + heading.id);
          anchorLink.setAttribute('tid',heading.id);
          anchorLink.innerText = headingText;
          
          // 创建一个新的TOC条目
          var tocItem = document.createElement('li');
          tocItem.classList.add('toc-' + headingTagName);
          tocItem.appendChild(anchorLink);

          // 将TOC条目添加到TOC列表中
          tocList.appendChild(tocItem);
        });
        // 将TOC列表添加到页面中
        $("#app").parent().append($(tocList));
        // 新增toc按钮
        $("<i id='toc-oper' class='el-icon-tickets' onclick='window.tocOperFn()'></i>").insertBefore("#toc");
    },
    // 监听地址栏变化
    onpopstate(event){
        if(window.location.hash.indexOf("?") > -1){
            let str = window.location.hash.split("?")[1];
            // 获取目标元素的id属性
            const targetId = str.split("=")[1];
            // 滚动到目标元素的位置
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
            $("#toc li").removeClass("current");
            setTimeout(() => {
                $("#toc [tid='"+targetId+"']").parent().addClass("current");
            }, 200);
        }
    }
}
// toc-oper的点击事件
window.tocOperFn = function(){
    let v = $("#toc");
    if (v.is(':visible')) {
        v.hide("slow"); 
    } else {
        v.show("slow");
    }
}