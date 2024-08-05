function parseMd(md) {
  //ul
  md = md.replace(/^\s*\n\*/gm, "<ul>\n*");
  md = md.replace(/^(\*.+)\s*\n([^\*])/gm, "$1\n</ul>\n\n$2");
  md = md.replace(/^\*(.+)/gm, "<li>$1</li>");

  //ol
  md = md.replace(/^\s*\n\d\./gm, "<ol>\n1.");
  md = md.replace(/^(\d\..+)\s*\n([^\d\.])/gm, "$1\n</ol>\n\n$2");
  md = md.replace(/^\d\.(.+)/gm, "<li>$1</li>");

  //blockquote
  md = md.replace(/^\>(.+)/gm, "<blockquote>$1</blockquote>");

  //h
  md = md.replace(/[\#]{6}(.+)/g, "<h6>$1</h6>");
  md = md.replace(/[\#]{5}(.+)/g, "<h5>$1</h5>");
  md = md.replace(/[\#]{4}(.+)/g, "<h4>$1</h4>");
  md = md.replace(/[\#]{3}(.+)/g, "<h3>$1</h3>");
  md = md.replace(/[\#]{2}(.+)/g, "<h2>$1</h2>");
  md = md.replace(/[\#]{1}(.+)/g, "<h1>$1</h1>");

  //alt h
  md = md.replace(/^(.+)\n\=+/gm, "<h1>$1</h1>");
  md = md.replace(/^(.+)\n\-+/gm, "<h2>$1</h2>");

  //images
  md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

  //links
  md = md.replace(
    /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,
    '<a href="$2" title="$4">$1</a>'
  );

  //font styles
  md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, "<b>$1</b>");
  md = md.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, "<i>$1</i>");
  md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, "<del>$1</del>");

  //pre
  md = md.replace(/^\s*\n\`\`\`(([^\s]+))?/gm, '<pre class="$2">');
  md = md.replace(/^\`\`\`\s*\n/gm, "</pre>\n\n");

  //code
  md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, "<code>$1</code>");

  //p
  md = md.replace(/^\s*(\n)?(.+)/gm, function (m) {
    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m)
      ? m
      : "<p>" + m + "</p>";
  });

  //strip p from pre
  md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, "$1$2");

  return md;
}

// 마크 다운 구현 : view에만 적용
/*
  document.addEventListener("DOMContentLoaded", function () {
    //API 연동시 이 부분 수정
    const testText = `#제목1
    ##제목2
    오늘 우리는 새로운 모바일 애플리케이션 개발을 위한 첫 번째 회의를 열었다. 주요 기능과 목표 사용자층을 정의하는 기획 단계를 시작했다. 이 과정을 통해 사용자가 앱을 통해 어떤 경험을 얻을지 명확하게 정리할 수 있었다. 팀원들과 함께 다양한 아이디어를 나누고, 최종적으로 프로젝트의 방향성을 설정했다. 기획이 완료된 후, 디자이너는 주요 화면의 레이아웃과 사용자 흐름을 시각적으로 나타내기 위해 와이어프레임을 제작하기 시작했다. 와이어프레임 덕분에 개발팀은 페이지 간의 연결성과 기능 배치를 명확하게 이해할 수 있었다. 클라이언트에게도 초기 디자인 방향에 대해 피드백을 받을 수 있어서 유용했다. 오늘 하루는 매우 생산적이었고, 앞으로의 개발 과정이 기대된다.`;
    
    const markdownBoxElements = document.getElementsByClassName("markdownBox");
    
    if (markdownBoxElements.length > 0) {
        const markdownBox = markdownBoxElements[0];
  
        function parse() {
            const md = testText;
            markdownBox.innerHTML = parseMd(md);
        }
  
        parse(); // Initial parse
    }
  });
  */

// // 마크 다운 구현: textarea대신 div with contenteditable
// document.addEventListener("DOMContentLoaded", function () {
//   var editorEls = document.getElementsByClassName("editor");

//   // Iterate over each editor element
//   Array.from(editorEls).forEach(function(editorEl) {
//     function parse() {
//       var md = editorEl.innerHTML;
//       editorEl.innerHTML = parseMd(md);

//       moveCursorToEnd(editorEl);
//     }

//     function moveCursorToEnd(el) {
//       var range = document.createRange();
//       var sel = window.getSelection();
//       range.selectNodeContents(el);
//       range.collapse(false);
//       sel.removeAllRanges();
//       sel.addRange(range);
//       el.focus();
//     }

//     editorEl.addEventListener("keydown", function (e) {
//       //엔터 클릭시
//       if (e.keyCode === 13) {
//         e.preventDefault();

//         parse();

//         var selection = window.getSelection();
//         var range = selection.getRangeAt(0);
//         var br = document.createElement("br");
//         range.deleteContents();
//         range.insertNode(br);

//         var newLine = document.createElement("p");
//         newLine.setAttribute("contenteditable", "true");
//         editorEl.appendChild(newLine);

//         //스크롤 위치 고정
//         editorEl.scrollTop = editorEl.scrollHeight;
//       }
//     });

//     parse();
//   });
// });

/* //기존의 코드
  var rawMode = true;
  (mdEl = document.getElementById("markdown")),
    (outputEl = document.getElementById("output-html")),
    (parse = function () {
      outputEl[rawMode ? "innerText" : "innerHTML"] = parseMd(mdEl.innerText);
    });
  
  parse();
  mdEl.addEventListener("keyup", parse, false);
  
  //Raw mode trigger btn
  (function () {
    var trigger = document.getElementById("raw-switch"),
      status = trigger.getElementsByTagName("span")[0],
      updateStatus = function () {
        status.innerText = rawMode ? "On" : "Off";
      };
  
    updateStatus();
    trigger.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        rawMode = rawMode ? false : true;
        updateStatus();
        parse();
      },
      false
    );
  })();
  */
