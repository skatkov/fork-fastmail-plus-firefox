// Right-hand menu toggle
const toggleRightbar = () => {
  $('button.v-Button--sidebar').first().click();
}

// Create conversation view controller

const $allButtons = $("<div />")
$allButtons.attr('id', 'allButtons');

const $conversationButtons = $("<div />")
$conversationButtons.attr('id', 'conversationButtons');

const createImageLabel = (imgPath, key) => {
  return "<span class='label'>" +
         `<img style='vertical-align:text-top' src='${chrome.runtime.getURL(imgPath)}' />` +
         "</span>";
}

const btnLeftbarLabel = () => {
  return createImageLabel("svg/fullscreen.svg", "^L");
}

const btnUpLabel = () => {
  return createImageLabel("svg/arrow-up.svg", "P/↑");
}

const btnDownLabel = () => {
  return createImageLabel("svg/arrow-down.svg", "N/↓");
}

const btnToggleLabel = () => {
  return createImageLabel("svg/view-list.svg", "E/⏎");
}

const btnExpandLabel = () => {
  return createImageLabel("svg/arrows-expand.svg", "⇧E/⇧⏎");
}

const btnCollapseLabel = () => {
  return createImageLabel("svg/arrows-collapse.svg", "⇧⌥E/⇧⌥⏎");
}

const btnControlLabel = () => {
  if(btnControlState == "shown"){
    return createImageLabel("svg/arrow-right-square.svg", "^,");
  } else {
    return createImageLabel("svg/arrow-left-square.svg", "^,");
  }
}

const $btnLeftbar = $(`<button>${btnLeftbarLabel()}</button>`).appendTo($conversationButtons);
$btnLeftbar.attr('id', 'btnLeftbar');
$btnLeftbar.attr('title', '^L');
$btnLeftbar.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

// Left-hand menu toggle
const toggleLeftBar = () => {
  $btnLeftbar.click();
}

const $btnUp = $(`<button><span class='label'>${btnUpLabel()}</span></button>`).appendTo($conversationButtons);
$btnUp.attr('id', 'btnUp');
$btnUp.attr('title', '↑');
$btnUp.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnDown = $(`<button><span class='label'>${btnDownLabel()}</span></button>`).appendTo($conversationButtons);
$btnDown.attr('id', 'btnDown');
$btnDown.attr('title', '↓');
$btnDown.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnToggle = $(`<button><span class='label'>${btnToggleLabel()}</span></button>`).appendTo($conversationButtons);
$btnToggle.attr('id', 'btnToggle');
$btnToggle.attr('title', '⏎');
$btnToggle.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnExpand = $(`<button><span class='label'>${btnExpandLabel()}</span></button>`).appendTo($conversationButtons);
$btnExpand.attr('id', 'btnExpand');
$btnExpand.attr('title', '⇧⏎');
$btnExpand.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnCollapse = $(`<button><span class='label'>${btnCollapseLabel()}</span></button>`).appendTo($conversationButtons);
$btnCollapse.attr('id', 'btnCollapse');
$btnCollapse.attr('title', '⇧⌥⏎');
$btnCollapse.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

$conversationButtons.appendTo($allButtons);
$controlerButton = $("<div />").appendTo($allButtons);

const $btnControl = $(`<button><span class='label'>${btnControlLabel()}</span></button>`).appendTo($controlerButton);
$btnControl.attr('id', 'btnControl');
$btnControl.attr('title', '^,');
$btnControl.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

$btnLeftbar.on('click', () => {
  if(leftbarState === "hidden"){
    showLeftbar();
    leftbarState = "shown";
  } else {
    hideLeftbar();
    leftbarState = "hidden";
  }
});

$btnToggle.on('click', () => {
  let focused = $("div.v-MessageCard.app-contentCard.is-focused")
  let current;
  if(focused.length > 0){
    current = focused.first();
  } else {
    current = $("div.v-MessageCard.app-contentCard").first();
  }
  current.find("div.v-MessageCard-header").click()
  setTimeout(() => {
    current.addClass("is-focused");
  }, 100);
});

$btnExpand.on('click', () => {
  $("div.v-MessageCard.app-contentCard.is-collapsed div.v-MessageCard-header").click();
});

$btnCollapse.on('click', () => {
  $("div.v-MessageCard.app-contentCard.is-expanded div.v-MessageCard-header").click();
});

$btnUp.on('click', () => {
  let focused = $("div.v-MessageCard.app-contentCard.is-focused");
  if (focused.length == 0){
    $("div.v-MessageCard.app-contentCard").last().addClass("is-focused");
  } else {
    if (focused.prev().length > 0){
      let newFocus = focused.removeClass("is-focused").prev().addClass("is-focused");
      newFocus.get(0).scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }
});

$btnDown.on('click', () => {
  let focused = $("div.v-MessageCard.app-contentCard.is-focused");
  if (focused.length == 0){
    $("div.v-MessageCard.app-contentCard").first().addClass("is-focused");
  } else {
    if (focused.next().length > 0){
      let newFocus = focused.removeClass("is-focused").next().addClass("is-focused");
      newFocus.get(0).scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }
});

$btnControl.on('click', () => {
  if(btnControlState === "shown"){
    $conversationButtons.hide('slide', {direction: 'right'});
    btnControlState = "hidden";
  } else {
    $conversationButtons.show('slide', {direction: 'right'});
    btnControlState = "shown";
  }
  setTimeout(() => {$btnControl.html(btnControlLabel())}, 200);
});

let originalLeftbarWidth1;
let originalLeftbarWidth2;
const showLeftbar = () => {
  $("div.v-Toolbar, div.v-PageHeader").css("display", "");
  // application order is important
  $("div.v-Split--right").css("left", originalLeftbarWidth1);
  $("div.v-Hierarchy.v-Page-content div.v-Split--right").css('left', originalLeftbarWidth2);
}
//
const hideLeftbar = () => {
  $("div.v-Toolbar, div.v-PageHeader").css("display", "none");
  // requesting order is important
  originalLeftbarWidth2 = $("div.v-Hierarchy.v-Page-content div.v-Split--right").css('left');
  $("div.v-Hierarchy.v-Page-content div.v-Split--right").css('left', '0px');
  originalLeftbarWidth1 = $("div.v-Split--right").css("left");
  $("div.v-Split--right").css("left", "0px");
}

$(window).on('resize', () => {
  const currentURL = location.href;
  toggleVisibility(currentURL);
});

const toggleVisibility = (url) => {
  if(regexConversation.test(url)){
    const splitRight = $("div.v-Hierarchy.v-Page-content div.v-Split--right");
    if(splitRight.length === 0 || parseInt(splitRight[0].getBoundingClientRect().width) > 400){
      $allButtons.appendTo("body");
      if(btnControlState === "hidden"){
        $conversationButtons.hide();
      } else {
        $conversationButtons.show();
      }
      if(leftbarState === "hidden"){
        hideLeftbar();
      }
    } else {
      $allButtons.detach();
    }
  } else {
    $allButtons.detach();
    showLeftbar();
  }
};
