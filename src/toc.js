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
        let len = headings.length;
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
        if(length > 0){
            // 将TOC列表添加到页面中
            $("#app").parent().append($(tocList));
            let color = "#2196F3";
            if(window.$mangodoc.themeColor){
            color = window.$mangodoc.themeColor;
            }
            // 新增toc按钮
            $("<i id='toc-oper' class='el-icon-tickets' onclick='window.tocOperFn()'></i>").css("color",color).insertBefore("#toc");
        }
    },
    ready(){
        injectStyle();
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

function injectStyle() {
    let themeColor = window.$mangodoc.themeColor;
    if(!themeColor){
      themeColor = "#409EFF";
    }
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        #app {
            width: 80% !important;
        }
        
        #toc {
            height: fit-content;
            max-height: 80%;
            width: 220px;
            position: fixed;
            right: 20px;
            top: 60px;
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 10px;
            margin: 0px;
            overflow: auto;
            list-style: none;
            background-color: #fff;
        }
        
        /* TOC列表样式 */
        #toc ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        /* TOC条目样式 */
        #toc li {
            margin: 5px 0;
            font-size: 14px;
            line-height: 1.5;
            letter-spacing: 1px;
        }
        
        /* 不同级别的标题条目样式 */
        #toc li.toc-h1 {
            color: #F44336;
            padding-left: 8px;
        }
        
        #toc li.toc-h2 {
            color: #4CAF50;
            padding-left: 15px;
        }
        
        #toc li.toc-h3 {
            color: ${themeColor};
            padding-left: 30px;
        }
        
        #toc li.toc-h4 {
            color: #9C27B0;
            padding-left: 45px;
        }
        
        #toc li.toc-h5 {
            color: #FFC107;
            padding-left: 60px;
        }
        
        #toc li.toc-h6 {
            color: #795548;
            padding-left: 75px;
        }
        
        /* 锚点链接样式 */
        #toc a {
            color: inherit;
            text-decoration: none;
            transition: all 0.2s ease-in-out;
        }
        
        #toc a:hover {
            color: ${themeColor};
        }
        
        #toc .current {
            border-left: 3px solid ${themeColor};
        }
        
        @media only screen and (max-width: 500px) {
            #app {
                width: 100% !important;
            }
        
            #toc {
                display: none;
                right: 8px;
            }
        
            #toc-oper {
                display: block !important;
                position: fixed;
                bottom: 8px;
                right: 8px;
                z-index: 999;
                font-size: 25px;
            }
        }
        
        #toc {
            height: fit-content;
            max-height: 80%;
        }
        
        #toc-oper {
            display: none;
        }
    `;
    document.head.insertBefore(styleEl, document.querySelector("head style, head link[rel*='stylesheet']"));
}