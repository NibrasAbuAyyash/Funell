// General variables
var username,getUser,drafts,draft,draftsCount,
    currentDraftKey,draftKey,currentURI,currentURIHash;

// Elements variables
var _currentPointHeader,_draftsIconCntr,_draftsIconLink,
    _draftsIconCount,_draftsIconImage,_currentPointFormAdd,
    _draftButtonSaveCntr,_draftAlertSuccess,_draftAlertDanger,
    _currentPointUserTabs,_draftsTabCntr,_draftsTabLink,
    _draftsCntr,_draftCntr,_draftLink,_draftTitle;

// General value
getUser = document.querySelector(".headerLinks #usrAvatar");
currentURI = window.location.href;
currentURIHash = window.location.hash;
draftKey = generationKey();
// General function
function generationKey () {
    if (currentURI.indexOf('#draft-') > -1) {
        return currentURIHash.split('-')[1];
    }

    var code = '',characters,i;
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
}
function saveDraft (e) {
    e.preventDefault();

    var drafts,draft,alertCntr,inputTitle,inputContent,
        inputCreatedAt,inputUpdateAt,date,dateNow;

    drafts = JSON.parse(localStorage.getItem('DraftsHusobIO'));

    if (!drafts) {
        drafts = {};
    }

    date = new Date();
    dateNow = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    inputTitle = document.querySelector("#new_post input[name='post[title]']").value;
    inputContent = document.querySelector("#new_post textarea[name='post[content]']").value;

    if (inputTitle == "" || inputContent == "") {
        _draftAlertDanger = document.createElement('div');
        _draftAlertDanger.setAttribute('class', 'alert alert-danger');
        _draftAlertDanger.setAttribute('style', 'padding: 7px 14px;font-size: 16px;margin: -10px 0 10px;');
        _draftAlertDanger.textContent = "الرجاء تعبئة كل مِن حقل العنوان والمحتوى، قبل حفظ المسودة!";

        alertCntr = document.querySelector('#new_post .addBtns');
        alertCntr.insertBefore(_draftAlertDanger, alertCntr.firstChild);
        return false;
    }

    if (drafts[draftKey]) {
        draft = drafts[draftKey];
        inputCreatedAt = draft.created_at;
    }
    else {
        inputCreatedAt = dateNow;
    }
    inputUpdateAt = dateNow;

    drafts[draftKey] = {
        'title': inputTitle,
        'content': inputContent,
        'created_at' : inputCreatedAt,
        'update_at' : inputUpdateAt
    }

    localStorage.setItem('DraftsHusobIO', JSON.stringify(drafts));

    _draftsIconCount.textContent = Object.keys(drafts).length;

    _draftAlertSuccess = document.createElement('div');
    _draftAlertSuccess.setAttribute('class', 'alert alert-success');
    _draftAlertSuccess.setAttribute('style', 'padding: 7px 14px;font-size: 16px;margin: -10px 0 10px;');
    _draftAlertSuccess.textContent = "تم حفظ المسودة بنجاح!";

    alertCntr = document.querySelector('#new_post .addBtns');
    _draftAlertDanger.remove();
    alertCntr.insertBefore(_draftAlertSuccess, alertCntr.firstChild);
}

if (getUser) {
    username = getUser.firstElementChild.getAttribute('href').split('/')[2];

    drafts = JSON.parse(localStorage.getItem('DraftsHusobIO'));
    if (!drafts) {
        draftsCount = 0;
    }
    else {
        draftsCount = Object.keys(drafts).length;
    }

    _draftsIconCntr = document.createElement('span');
    _draftsIconCntr.setAttribute('class', 'hdrMenus pull-left');
    _draftsIconCntr.setAttribute('style', 'width: 50px;min-height: 74px;display: block;cursor: pointer; ' +
                                          'box-sizing: border-box;text-align: center;margin-left: -.3em;');

    _draftsIconLink = document.createElement('a');
    _draftsIconLink.setAttribute('id', 'draft_link');
    _draftsIconLink.setAttribute('href', '/u/' + username + '#drafts');
    _draftsIconLink.setAttribute('style', 'color: #666;padding: 10px 10px 0;display: block;min-height: 74px;position: relative;');

    _draftsIconCount = document.createElement('span');
    _draftsIconCount.setAttribute('class', 'num');
    _draftsIconCount.setAttribute('style', 'display: block;min-height: 19px;position: absolute;padding: 4px 5px 0px;' +
                                                 'border-radius: 100%;background: #dd4814;color: #fff;font-size:10px;' +
                                                 'top: 17px;left: 7px;z-index: 10;');
    _draftsIconCount.textContent = draftsCount;

    _draftsIconImage = document.createElement('i');
    _draftsIconImage.setAttribute('class', 'fa fa-file');
    _draftsIconImage.setAttribute('style', 'font-size: 18px;color: #666;padding-top: 18px;');

    _currentPointHeader = document.querySelector('.headerLinks span:nth-child(6)');
    _currentPointHeader.parentNode.setAttribute('style', 'width:auto;');

    _draftsIconLink.appendChild(_draftsIconCount);
    _draftsIconLink.appendChild(_draftsIconImage);
    _draftsIconCntr.appendChild(_draftsIconLink);
    _currentPointHeader.parentNode.insertBefore(_draftsIconCntr, _currentPointHeader.nextSibling);


    // Add Post Page
    if (currentURI.indexOf('/add/post') > -1) {

        _draftButtonSaveCntr = document.createElement("button");
        _draftButtonSaveCntr.setAttribute("class", "btn btn-primary");
        _draftButtonSaveCntr.textContent = "احفظ كمسودة";

        _currentPointFormAdd = document.querySelector('#new_post .addBtns button');

        _currentPointFormAdd.parentNode.insertBefore(_draftButtonSaveCntr, _currentPointFormAdd.nextSibling);

        _draftButtonSaveCntr.addEventListener('click', saveDraft, true);

        // Get data & set to inputs
        if (currentURI.indexOf('#draft-') > -1) {
            currentDraftKey = currentURIHash.split('-')[1];

            draft = drafts[currentDraftKey];
            if (draft) {
                document.querySelector("#new_post input[name='post[title]']").value = draft.title;
                document.querySelector("#new_post textarea[name='post[content]']").value = draft.content;
                document.querySelector("#new_post #editable_post_content").textContent = draft.content;
            }
        }
    }

    // Drafts tab in profile page
    if (currentURI.indexOf('/u/' + username) > -1) {
        _draftsTabCntr = document.createElement('li');

        _draftsTabLink = document.createElement("a");
        _draftsTabLink.setAttribute('href', '/u/' + username + '#drafts');
        _draftsTabLink.textContent = 'مسوداتي';

        _currentPointUserTabs = document.querySelector('.communitiesTabs .profile li:nth-child(2)');

        _draftsTabCntr.appendChild(_draftsTabLink);
        _currentPointUserTabs.parentNode.insertBefore(_draftsTabCntr, _currentPointUserTabs.nextSibling);

        if (currentURI.indexOf('/u/' + username + '#drafts') > -1) {
            document.querySelector(".tab-content  .communityCardsBlocks").remove();
            document.querySelector(".tab-content  .clear").remove();
            document.querySelector(".tab-content  #more_content").remove();
            document.querySelector('.communitiesTabs .profile li:first-child').removeAttribute("class");
            _draftsTabCntr.setAttribute('class', 'active');

            _draftsCntr =  document.createElement("div");
            _draftsCntr.setAttribute("id", "posts");
            _draftsCntr.setAttribute("class", "itemsList");

            for (draftKey in drafts) {
                draft = drafts[draftKey];

                _draftCntr = document.createElement('div');
                _draftCntr.setAttribute('id', 'draft-' + draftKey);
                _draftCntr.setAttribute('class', 'listItem idthing');

                _draftLink = document.createElement('a');
                _draftLink.setAttribute('href', '/add/post#draft-' + draftKey);

                _draftTitle = document.createElement('h2');
                _draftTitle.setAttribute('style', 'line-height: 1.8;margin-top: 0;font-size: 18px;margin-bottom: 0;margin-right: 10px;');
                _draftTitle.textContent = draft.title;

                _draftLink.appendChild(_draftTitle);
                _draftCntr.appendChild(_draftLink);
                _draftsCntr.appendChild(_draftCntr);
            }

            document.querySelector('.tab-content').appendChild(_draftsCntr);
        }
    }
}
