/// <reference path="../Scripts/jquery-1.8.2.js" />
/// <reference path="data.js" />

function hideById(id) {
    $("#" + id).hide();
}
function showById(id) {
    $("#" + id).show();
}
function readURLparameters(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

function Len(strInput) {
    if (strInput != null) {
        return strInput.length;
    }
    else {
        return 0;
    }
}

function highlight(field) {
    field.focus();
    field.select();
}

function convertToDateTime(epoch) {
    var myDate = new Date(epoch * 1000);
    return myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear();
}

function deleteLogincookie() {
    $.removeCookie("JSESSIONID");
}

//get site language
function getCurrentLanguage() {
    var cookielanguage = $.cookie("language");
    if (cookielanguage) {
        return cookielanguage;
    }
    else {
        return "nn_NO";
    }
}
//
//Register
//-------------------------------------------------------------------------------------------------
function doRegister() {
    var lang = getCurrentLanguage().toLowerCase();
    hideById("box_02");
    $("#box1_content").load("/html/register_choose_type_" + lang + ".html");
}

function register_choose_type() {
    var selectedRegType = $("#selectedRegType").val();
    if (selectedRegType == 1) {
        register_team_step1();
    } else if (selectedRegType == 2) {
        register_person_step1();
    } else {
        doRegister();
    }
}

//register team step1
function register_team_step1() {
    var lang = getCurrentLanguage().toLowerCase();
    hideById("box_02");
    $("#box1_content").load("/html/register_step1_" + lang + ".html", function () {
        $("#newTeamName").focus();
    }
    );
}
//register team step 2
function register_step2() {
    var lang = getCurrentLanguage().toLowerCase();
    var newteamname = $('#newTeamName').val();
    $.ajax({
        url: "/mo/data/controller?module=teamwizard&action=newteam",
        dataType: "json",
        type: "Post",
        data: { teamName: newteamname },
        success: function (result) {
            if (result[0].action == "admin") {
                $("#box1_content").load("/html/register_step2_" + lang + ".html", function () {
                    $("#adminfirstName").focus();
                })
            }
            else {
                if (result[0].response == "exception") {
                    alert("Registration failed:" + result[0].message);
                }
            }
        }
    });
}
//register team step3
function register_step3() {
    var adminfirstName = $('#adminfirstName').val();
    var adminlastName = $('#adminlastName').val();
    var adminemail = $('#adminemail').val();
    var adminmobilePhone = $('#adminmobilePhone').val();
    var adminaddress1 = $('#adminaddress1').val();
    var adminaddress2 = $('#adminaddress2').val();
    var admincity = $('#admincity').val();
    var adminzipCode = $('#adminzipCode').val();
    var admincountryRef = $('#admincountryRef').val();
    var adminpassword = $('#adminpassword').val();
    var admin = new Person(adminfirstName, adminlastName, adminemail, adminpassword, adminmobilePhone, adminaddress1, adminaddress2, adminzipCode, admincity, admincountryRef);
    var teamname = $('#hiddenTeamname').val();//you need to provide in /html/register_step2.html
    var team = new Team(teamname, admin);
    var json = JSON.stringify(team);
    $.ajax({
        url: "/mo/data/controller?module=teamwizard&action=newadmin",
        dataType: "json",
        type: "Post", // I think post is the better than get in this case
        data: json,
        success: function (result) {
            var lang = getCurrentLanguage().toLowerCase();
            response = result[0];
            var registerresponse2 = response.response;
            var registeraction2 = response.action;
            if (registeraction2 == "created") {
                $("#box1_content").load("/html/register_success_" + lang + ".html");
            }

            if (registerresponse2 == "exception") {
                var errormsg = response.message;
                alert('Registration failed: ' + errormsg);
            }
        }
    });
}
//register person
function register_person_step1() {
    var lang = getCurrentLanguage().toLowerCase();
    hideById("box_02");
    $("#box1_content").load("/html/register_person_step1_" + lang + ".html", function () {
    }
    );
}
function register_person_step2() {
    var personfirstName = $('#personfirstName').val();
    var personlastName = $('#personlastName').val();
    var personemail = $('#personemail').val();
    var personmobilePhone = $('#personmobilePhone').val();
    var personaddress1 = $('#personaddress1').val();
    var personaddress2 = $('#personaddress2').val();
    var personcity = $('#personcity').val();
    var personzipCode = $('#personzipCode').val();
    var personcountryRef = $('#personcountryRef').val();
    var personpassword = $('#personpassword').val();
    var person = new Person(personfirstName, personlastName, personemail, personpassword, personmobilePhone, personaddress1, personaddress2, personzipCode, personcity, personcountryRef);
    var json = JSON.stringify(person);
    $.ajax({
        url: "/mo/data/controller?module=personwizard&action=create",
        dataType: "json",
        type: "Post", // I think post is the better than get in this case
        data: json,
        contentType: "application/json; charset=UTF-8",
        success: function (result) {
            var lang = getCurrentLanguage().toLowerCase();
            response = result[0];
            var registerresponse2 = response.response;
            var registeraction2 = response.action;
            if (registeraction2 == "created") {
                $("#box1_content").load("/html/register_person_success_" + lang + ".html");
            }

            if (registerresponse2 == "exception") {
                var errormsg = response.message;
                alert('Registration failed: ' + errormsg);
            }
        }
    });
}

//
//Login
//-----------------------------------------------------------------------------------------------------------------
//login
function doLogin() {
    var loginusername = $('#login-username').val();
    var loginpassword = $('#login-password').val();
    $.ajax({
        url: "/mo/data/controller?module=login&action=mologin",
        dataType: "json",
        type: "Post", //need post in this case
        data: { 'username': loginusername, 'password': loginpassword },
        success: function (result) {
            response = result[0];
            var loginresponse = response.response;
            var date = new Date();
            date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
            var expires = '';
            expires = +date.toGMTString();

            if (loginresponse == "login") {
                var sessionid = response.id;
                var preflang = response.lang;
                //$.cookie("JSESSIONID", sessionid, { expires: expires, path: '/' });
                $.cookie("JSESSIONID", sessionid);
                $.cookie("language", preflang);
                window.location.href = "/mo/?lang=" + preflang;
            }
            if (loginresponse == "error") {
                var errormsg = response.message;
                alert('Login failed: ' + errormsg);
            }
        }
    });
}
//logout
function doLogout() {
    $.ajax({
        url: "/mo/data/controller?module=logout&action=mologout",
        dataType: "json",
        type: "Post",
        success: function (result) {
            response = result[0];
            if (response.response == "logout") {
                $.cookie("isLogout", "1", { path: "/" });
                document.location = "/";
            }
        }
    });
    //$.getJSON("/mo/data/controller?module=logout&action=mologout", {}, function (data) {
    //    response = data[0];
    //    deleteLogincookie();
    //    //if (response.response == "logout") {
    //    //    deleteLogincookie();
    //    //    document.location = "/";
    //    //}
    //}, "json");
}

//
//mo/index.html
//-----------------------------------------------------------------------------------------------------------------

//load left menu in mo/index.html
function loadLeftMenu() {
    var lang = getCurrentLanguage().toLowerCase();
    $("#left_submenu").load("/html/mypage_leftmenu_" + lang + ".html");
}

//load user infomation
function openUserInfo() {
    $.ajax({
        url: "/mo/data/controller?module=user&action=mouserinfo",
        dataType: "json",
        type: "Post",
        cache: false,
        success: function (result) {
            //$("#messageTitle").html("User profile");
            var response = result[0];
            if (response.response == "userinfo") {
                var username = response.userName;
                var firstname = response.firstName;
                var lastname = response.lastName;
                $("#dynamicContent").html("<p><strong>User information</strong></p><p>username : " + username + "</p><p>firstname: " + firstname + "</p><p>lastname: " + lastname + "</p>");
            }
        }
    });

    $.ajax({
        url: "/mo/data/controller?module=user&action=moroles",
        dataType: "json",
        type: "Post",
        cache: false,
        success: function (result) {
            var response = result[0];
            if (response.response == "roles") {
                var str = "<p><strong>Roles information</strong></p>";
                for (var i = 1; i < result.length; i++) {
                    str += "<div class='listrolegroup'><p>Group name: " + result[i].groupName + "</p>Role type: " + result[i].roleTypeName + "</p></div>";
                }
                $("#dynamicContent").append(str);
            }
        }
    });
}

//Load view message
function loadViewMessage() {
    var lang = getCurrentLanguage().toLowerCase();
    //$("#messageTitle").html("Message center");
    $("#dynamicContent").load("/html/viewmessage_" + lang + ".html");
}

//Load new message
function loadNewMessage() {
    //$("#messageTitle").html("New message");
    var lang = getCurrentLanguage().toLowerCase();
    $("#dynamicContent").load("/html/newmessage_" + lang + ".html");
}
//Load new sms
function loadNewSms() {
    //$("#messageTitle").html("New SMS");
    var lang = getCurrentLanguage().toLowerCase();
    $("#dynamicContent").load("/html/newsms_" + lang + ".html");
}
//
//mo/newmessage.html
//-----------------------------------------------------------------------------------------------------------------

function GetContact() {
    var contacts = [];
    $.ajax({
        url: "/mo/data/controller?module=user&action=contacts",
        dataType: "json",
        type: "Get",
        async: false,
        cache: false,
        success: function (result) {
            var response = result[0];
            if (response.response == "contacts") {
                for (var i = 1; i < result.length; i++) {
                    contacts.push(result[i]);
                }
            }
        }
    });
    return contacts;
}

//Show message infomation in top
function showMessageInfo(message) {
    $("#infonotice").append(message);
}
//Hide message information in top
function hideMessageInfo(id) {
    $("#" + id).fadeOut(3000);
    $("#" + id).remove();
}

//
//mo/viewmessage.html
//-----------------------------------------------------------------------------------------------------------------

//global object
var AllMessages = [];
//load all messages
function loadAllMessages() {
    //load all unread messages
    $.ajax({
        url: "/mo/data/controller?module=user&action=mouserunreadmessages",
        dataType: "json",
        type: "Get",
        async: false,
        cache: false,
        success: function (result) {
            if (result[0].response == "userunreadmessages") {
                for (var i = 1; i < result.length; i++) {
                    AllMessages.push(result[i]);
                }
            }
        }
    });
    $.ajax({
        url: "/mo/data/controller?module=user&action=momessages&count=500&start=0",
        dataType: "json",
        type: "Get",
        async: false,
        cache: false,
        success: function (result) {
            if (result[0].response == "messages") {
                for (var i = 1; i < result.length; i++) {
                    AllMessages.push(result[i]);
                }
            }
        }
    });
}
function getMessages(pagesize, pageindex) {
    var starMessagesIndex = pagesize * (pageindex - 1)
    starMessagesIndex = starMessagesIndex > 0 ? starMessagesIndex : 0;
    var endMessagesIndex = pagesize * pageindex;
    endMessagesIndex = endMessagesIndex < AllMessages.length ? endMessagesIndex : AllMessages.length;
    var messages = [];
    for (var i = starMessagesIndex; i < endMessagesIndex; i++) {
        messages.push(AllMessages[i]);
    }
    return messages;
}

//load next messages
function nextMessagesClick(pagesize) {
    var pageIndex = 1;
    if ($.cookie("messagesIndex")) {
        pageIndex = parseInt($.cookie("messagesIndex"));
    }
    else {
        $.cookie("messagesIndex", 1);
    }
    pageIndex = pageIndex + 1;
    return nextMessages(pagesize, pageIndex);
}
function nextMessages(pagesize, pageIndex) {
    var maxPageIndex = 1;
    if (AllMessages.length > pagesize) {
        if (AllMessages.length % pagesize == 0) {
            maxPageIndex = AllMessages.length / pagesize;
        }
        else {
            maxPageIndex = parseInt(AllMessages.length / pagesize) + 1;
        }
    }
    pageIndex = pageIndex < maxPageIndex ? pageIndex : maxPageIndex;
    $.cookie("messagesIndex", pageIndex);
    return getMessages(pagesize, pageIndex);
}
//load previous messages
function previousMessagesClick(pagesize) {
    var pageIndex;
    if ($.cookie("messagesIndex")) {
        pageIndex = parseInt($.cookie("messagesIndex"));
    }
    else {
        return null;
    }
    pageIndex = pageIndex - 1;
    return previousMessages(pagesize, pageIndex);
}
function previousMessages(pagesize, pageIndex) {
    pageIndex = pageIndex > 0 ? pageIndex : 1;
    $.cookie("messagesIndex", pageIndex);
    return getMessages(pagesize, pageIndex);
}

//clear all cookie message and detach event for reply button
function clearMessageCookie() {
    AllMessages = [];
    $.removeCookie('messagesIndex');
    $.removeCookie("frommessageName");
    $.removeCookie("subjectmessage");
    $.removeCookie("contentmessage");
    $.removeCookie("datemessage");
    $("#replybutton").detach();
}

//for sent messages

//global object
var AllSentMessages = [];
//load all sent messages
function loadAllSentMessages() {
    $.ajax({
        url: "/mo/data/controller?module=user&action=mosentmessages&count=0&start=0",
        dataType: "json",
        type: "Get",
        async: false,
        cache: false,
        success: function (result) {
            if (result[0].response == "sentmessages") {
                for (var i = 1; i < result.length; i++) {
                    AllSentMessages.push(result[i]);
                }
            }
        }
    });
}
function getSentMessages(pagesize, pageindex) {
    var starMessagesIndex = pagesize * (pageindex - 1)
    starMessagesIndex = starMessagesIndex > 0 ? starMessagesIndex : 0;
    var endMessagesIndex = pagesize * pageindex;
    endMessagesIndex = endMessagesIndex < AllSentMessages.length ? endMessagesIndex : AllSentMessages.length;
    var messages = [];
    for (var i = starMessagesIndex; i < endMessagesIndex; i++) {
        messages.push(AllSentMessages[i]);
    }
    return messages;
}

//load next messages
function nextSentMessagesClick(pagesize) {
    var pageIndex = 1;
    if ($.cookie("sentmessagesIndex")) {
        pageIndex = parseInt($.cookie("sentmessagesIndex"));
    }
    else {
        $.cookie("sentmessagesIndex", 1);
    }
    pageIndex = pageIndex + 1;
    return nextsentMessages(pagesize, pageIndex);
}
function nextsentMessages(pagesize, pageIndex) {
    var maxPageIndex = 1;
    if (AllSentMessages.length > pagesize) {
        if (AllSentMessages.length % pagesize == 0) {
            maxPageIndex = AllSentMessages.length / pagesize;
        }
        else {
            maxPageIndex = parseInt(AllSentMessages.length / pagesize) + 1;
        }
    }
    pageIndex = pageIndex < maxPageIndex ? pageIndex : maxPageIndex;
    $.cookie("sentmessagesIndex", pageIndex);
    return getSentMessages(pagesize, pageIndex);
}
//load previous messages
function previousSentMessagesClick(pagesize) {
    var pageIndex;
    if ($.cookie("sentmessagesIndex")) {
        pageIndex = parseInt($.cookie("sentmessagesIndex"));
    }
    else {
        return null;
    }
    pageIndex = pageIndex - 1;
    return previousSentMessages(pagesize, pageIndex);
}
function previousSentMessages(pagesize, pageIndex) {
    pageIndex = pageIndex > 0 ? pageIndex : 1;
    $.cookie("sentmessagesIndex", pageIndex);
    return getSentMessages(pagesize, pageIndex);
}

function clearSentMessageCookie() {
    AllSentMessages = [];
    $.removeCookie('sentmessagesIndex');
}

$(function () {
    //set focus and blur input text
    $("input.input_focus_blur").each(function (index, item) {
        $(item).focus(function () {
            if ($(this).attr("title") == $(this).val()) {
                $(this).val("");
            }
        });
        $(item).blur(function () {
            if ($(this).val() == "") {
                $(this).val($(this).attr("title"));
            }
        });
    });
});