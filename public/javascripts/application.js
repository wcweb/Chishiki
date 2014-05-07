(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var example = require('./../../lib/example/quiz').quiz;


/*
 {
 quiz:{
 _id:
 index:
 isActive: true,
 question: { type : String, default : '', trim : true},
 answers: [{
 _id:
 index:
 option : { type: String, default : '', trim : true},
 correct: { type: Boolean, default : false }
 }],
 correct: { type: String, default : '', trim : true},
 incorrect: { type: Boolean, default : false }
 }
 }


 {
 action: [
 add: {
 which parent
 },
 remove: {
 which node
 }
 ],
 reindex: function
 }
 */

var NodeTree = function NodeTree(parent) {
        this.elements = [];
        this.children = [];
        this.parent = {};
        this.template = "";
        this.index = -1;
        this.templateId = "";

        if (parent){
            this.parent = parent;
            parent.add(this);
        }
    }
    , NodeElement = function NodeElement(template) {
        this.template = template;
        this.templateId = "";
        this.index = -1;
        this.parent = {};
    };


NodeTree.prototype.add = function (child) {
    if (child.constructor.name == 'NodeElement') {
        child.index =this.elements.length;
        this.elements.push(child);
        child.parent = this;

    }
    if (child.constructor.name == 'NodeTree') {

        child.index = this.children.length;
        this.children.push(child);
        child.parent = this;

    }

    //@TODO
    //$(this.template).append(child.template);
}


NodeTree.prototype.remove = function (idx, childType) {
    if (childType == "NodeTree") {
        this.children.splice(idx, 1);
        var len = this.children.length;
        for (var i = idx; i < len; i++) {
            this.children[i].index -= 1;
        }
    }
    //@TODO
    //$(this.template).remove(child.template);
}

NodeElement.prototype.setIndex = function (idx) {
    this.index = idx;
}


//
//var nt = new NodeTree(null);
//var nt2 = new NodeTree(null);
//
//var nnt = new NodeTree(nt);
//nt.add(nnt);
//nt.add(nnt);
//console.log(nt.children.length);
//var ele = new NodeElement('sssss');
//
//nt.add(ele);
//nt.remove(1,nnt.constructor.name);
//console.log(nt.children.length);
//nt.add(new NodeElement('sssss2'));
//console.log('after',ele);
//console.dir(nt.toString());
//console.log("constructor",nt.constructor.name.toString());
//console.log(nt);


var config = {
        data: {},
        methodType: 'GET',
        wrapper: 'body'
    }, lastClick = {}, nodeTree,
    reformerData = function (data) {


        data['actionName'] = data.quizzes.length > 0 ? "Update" : "Save";

        if (!data.quizzes.length) {
            var demoQuiz = {quiz: example};
            data.quizzes.push(demoQuiz);
            //config.methodType = 'POST';
        } else {
            config.methodType = 'PUT';
        }

        data.quizzes[0].quiz.questions[0].isActive = true;


        return {form: data};
    },

    reTemplate = function (next) {
        var data = config.data;
        var nt = new NodeTree(null);
        nt.template = $('#quizzes-group-0');
        nt.templateId = '#quizzes-group-0';


        for (var idx = 0; idx < data.quizzes[0].quiz.questions.length; idx++) {
//            data.quizzes[idx].index = idx;  // handlebar have been added hindex an oindex.
            (function (idx, nodeTree) {

                var childTree = new NodeTree(nodeTree);

                var cT = $('#group-pane-0-' + idx);
                childTree.template = cT;
                childTree.templateId = '#group-pane-0-' + idx;
                var currentQuiz = data.quizzes[0].quiz.questions[idx];
                for (var j = 0; j < currentQuiz.answers.length; j++) {
                    (function (j) {
                        var childElementTemplate = $('#group-pane-sub-' + idx + '-' + j);
                        var childElement = new NodeElement($(childElementTemplate));
                        childElement.templateId = '#group-pane-sub-' + idx + '-' + j;
                        childTree.add(childElement);
                    })(j);
                }

            })(idx, nt);

        }
        console.log('reTemplate', nt);
        nodeTree = nt;

        next();
    },

    buildReduce = function (data) {
        for (var prop in data) {
            var element = data[prop];
            if (isArray(element)) {
                //buildReduce(element);

            }
        }
    },
    addChildNode = function (target) {
        // case index == 0 : tab panel
        // case index == 1 : groups
        // case index >=1 : group

        // create template with data.property
        // template append

        // combing target with action
        // events bind with button.


        var targetString = target;
        console.log(targetString);
        if (targetString.indexOf('nav') >= 0) {
            // handle tree node now.

            var cloneNode = nodeTree.children[0];
            console.log(nodeTree.children);
            var parent = cloneNode.parent;
            var templateClone = getEmptyNodeTemplate($(parent.children[0].templateId).clone());
            console.log("templateClone",templateClone);
            var templateNavClone = ($('#quizzes-groups-nav li').first().clone());
            var newIndex = parent.children[0].templateId;// #sub-0-0-0-...  when nodeTree.templateId ='';
            var childrenIndex = parent.children.length;

            if (newIndex.indexOf('#') >= 0) {
                newIndex = newIndex.slice(newIndex.indexOf('#') + 1);
            }

            var indexArray = newIndex.split('-');
            var newId = '';
            for (var i = 0; i < indexArray.length - 1; i++) {
                newId += indexArray[i] + "-";
            }


            newId += childrenIndex;


            $(templateClone).attr('id', newId);

            $(templateClone).find('#options-group-pane-sub-0-0-wrapper .group-pane-sub').each(function (idx, ele) {
                var tempId = $(ele).attr('id');
                var idArray = tempId.split('-');
                $(ele).find('button').attr('data-target', '#group-pane-sub-' + childrenIndex + '-' + idx);
                $(ele).attr('id', 'group-pane-sub-' + childrenIndex + '-' + idArray[idArray.length - 1]);

                var tempName = $(ele).find('input[type="checkbox"]').attr('name');
                tempName = "quizzes[" + childrenIndex + "][answers][" + idx + "][correct]";
                $(ele).find('input[type="checkbox"]').attr('name', tempName);

                var tempName = $(ele).find('input[type="text"]').attr('name');
                tempName = "quizzes[" + childrenIndex + "][answers][" + idx + "][option]";
                $(ele).find('input[type="text"]').attr('name', tempName);

            });
            console.log('childrenIndex',childrenIndex);
            $(templateClone).find('.group-pane-sub-add-btn')
                .attr('data-target', '#group-pane-0-' + childrenIndex + '-0');
            $(templateClone).find('.group-pane-remove-btn')
                .attr('data-target','#group-pane-0-'+childrenIndex);




            var newTree = new NodeTree();
            newTree.children = parent.children[0].children.slice(0);
            newTree.elements = parent.children[0].elements.slice(0);

            // walk through the cloned tree
            for (var i = 0; i < newTree.children.length; i++) {
                var child = newTree.children[i];
                var idArray = child.templateId.split('-');
                idArray[idArray.length - 2] = childrenIndex;
                child.templateId = idArray.join('-');
                child.template = $(child.templateId);
                child.parent = newTree;
            }
            for (var i = 0; i < newTree.elements.length; i++) {
                (function () {
                    var element = newTree.elements[i];
                    var idArray = element.templateId.split('-');
                    idArray[idArray.length - 2] = childrenIndex;
                    element.templateId = idArray.join('-');
                    element.template = $(element.templateId);
                    element.parent = newTree;
                })();

            }


            newTree.template = $(templateClone);
            newTree.templateId = '#' + newId;

            // append nav li

            $('#quizzes-groups-nav li').each(function (idx, ele) {
                if ($(ele).hasClass('active')) $(ele).removeClass('active');
            });
            $(templateNavClone).find('a').html(childrenIndex + 1).attr('href', newTree.templateId);
            $(templateNavClone).attr('id','group-nav-'+childrenIndex);


            $('#quizzes-groups-nav').append(templateNavClone);
//            $(templateNavClone).addClass('active');
//

            // append content
//            $('#quizzes-group-0 .tab-pane').each(function (idx, ele) {
//                if ($(ele).hasClass('active')) $(ele).removeClass('active');
//            });
//            console.log(parent.templateId);


            $(parent.templateId).append(newTree.template);
            //$(newTree.template).addClass('active');
            $('#quizzes-groups-nav li:eq('+(childrenIndex)+') a').tab('show');
            parent.add(newTree);

        } else {
            // handle element node now.
            var whichNode = getChildNode(targetString);
            console.log('which', whichNode);
            var parent = whichNode.parent;
            var templateClone = getEmptyNodeTemplate($(parent.elements[0].templateId).clone());
            var newIndex = parent.elements[0].templateId;
            var elementsIndex = parent.elements.length;

            if (newIndex.indexOf('#') >= 0) {
                console.log("newindex", newIndex.indexOf('#'));
                newIndex = newIndex.slice(newIndex.indexOf('#') + 1);

            }

            console.log("newindex", newIndex);
            var indexArray = newIndex.split('-');
            var newId = '';
            for (var i = 0; i < indexArray.length - 1; i++) {
                newId += indexArray[i] + "-";
            }


            newId += elementsIndex;


            var newElement = new NodeElement();

            // set name and id to input.

            $(templateClone).attr('id', newId).find('button').attr('data-target', '#' + newId);

            var tempName = $(templateClone).find('input[type="checkbox"]').attr('name');
            tempName = "quizzes[" + parent.index + "][answers][" + elementsIndex + "][correct]";
            $(templateClone).find('input[type="checkbox"]').attr('name', tempName);

            var tempName = $(templateClone).find('input[type="text"]').attr('name');
            tempName = "quizzes[" + parent.index + "][answers][" + elementsIndex + "][option]";
            $(templateClone).find('input[type="text"]').attr('name', tempName);

            newElement.template = $(templateClone);

            newElement.templateId = '#' + newId;


            $(parent.templateId + ' .options-group').append(newElement.template);
            parent.add(newElement);

        }


    },
    getEmptyNodeTemplate = function (templateClone) {
        $(templateClone).find('input').val('').attr('value', '');
        $(templateClone).find('textarea').html('');
        $(templateClone).find("[type='checkbox']").prop('checked', false);
        return $(templateClone);
    },
    getChildNode = function (targetString) {

        if (targetString.lastIndexOf('sub') >= 0)
            targetString = targetString.substr(targetString.lastIndexOf('sub-') + 4);

        if (targetString.indexOf('group-pane-0') >= 0)
            targetString = targetString.substr(targetString.indexOf('group-pane-0-') + 13);

        var indexArray = targetString.split('-');

        var stringTarget = "nodeTree";

        for (var j = 0; j < indexArray.length; j++) {
            if (indexArray[j] !== "") {
                if (j % 2) {
                    stringTarget += ".elements[" + indexArray[j] + "]";
                } else {
                    stringTarget += ".children[" + indexArray[j] + "]";

                }
            }
        }

        //console.log(stringTarget);
        return   eval(stringTarget);
    },
    removeChildNode = function (target) {

        // sub-1-2  level 1 second one.

        var targets = $(target);
        console.log(targets);
        var i = 0;
        for (var i = 0; i < targets.length; i++) {
            var finalFn = function (treeArray, whichIndex,type) {
                console.log(whichIndex != 0);

                if(whichIndex != 0){
                    if(type == 'NodeTree'){
                        if(whichIndex < treeArray.length-1){

                            $('#quizzes-groups-nav li:eq('+whichIndex+') a').tab('show')

                        }else if(whichIndex-1 > 0){
                            $('#quizzes-groups-nav li:eq('+(whichIndex-1)+') a').tab('show')
                        }else{
                            $('#quizzes-groups-nav li:eq(0) a').tab('show')
                        }
                    }

                    treeArray.splice(whichIndex, 1);
                }



            };
            (function (done) {
                var targetString = $(targets[i]).attr('id');
                console.log(targetString);
                var whichNode = getChildNode(targetString);
                var whichIndex = whichNode.index;
                var parentTree = whichNode.parent;

                if (whichIndex !== 0) $('div').remove(whichNode.templateId);

                if(whichNode.constructor.name == 'NodeElement') {

                    for (var idx = whichIndex+1; idx < parentTree.elements.length; idx++) {
                        (function () {
                            //if(idx == whichIndex) continue;

                            parentTree.elements[idx].index = idx;
                            var newId = idx - 1;
                            var newTemplateId = 'group-pane-sub-' + parentTree.index + '-' + newId;
                            var tempOldIdObject = $(parentTree.elements[idx].templateId);
                            tempOldIdObject.attr('id', newTemplateId);

                            newTemplateId = "#" + newTemplateId;

                            tempOldIdObject.find('button').attr('data-target', newTemplateId);

                            var tempName = tempOldIdObject.find('input[type="checkbox"]').attr('name');
                            tempName = "quizzes[" + parentTree.index + "][answers][" + newId + "][correct]";
                            tempOldIdObject.find('input[type="checkbox"]').attr('name', tempName);

                            var tempName = tempOldIdObject.find('input[type="text"]').attr('name');
                            tempName = "quizzes[" + parentTree.index + "][answers][" + newId + "][option]";
                            tempOldIdObject.find('input[type="text"]').attr('name', tempName);


                            parentTree.elements[idx].templateId = newTemplateId;

                            if (idx == parentTree.elements.length - 1) {
                                done(parentTree.elements, whichIndex,'NodeElement');
                            }
                        })();
                    }
                }else if(whichNode.constructor.name == 'NodeTree'){
                    console.log('whichIndex:',whichIndex);
                    if(whichIndex != 0) $('#group-nav-'+whichIndex).remove();

                    for (var idx = whichIndex; idx < parentTree.children.length; idx++) {
                        if(idx == whichIndex){

                            if (idx == parentTree.children.length - 1 || idx == 0) {

                                return done(parentTree.children, whichIndex,'NodeTree');
                            }
                            continue;
                        };
                        (function () {

                            //if(idx == whichIndex) continue;
                            $('#group-nav-'+idx).children('a').html(idx).attr('href','#group-pane-0-'+(idx-1));
                            $('#group-nav-'+idx).attr('id','group-nav-'+(idx-1));
                            $('#group-pane-0-'+idx).attr('id','group-pane-0-'+(idx-1));
                            $('#group-pane-0-'+idx).find('.group-pane-remove-btn')
                                .attr('data-target','#group-pane-0-'+(idx-1));
                            parentTree.children[idx].index = idx-1;
                            parentTree.children[idx].templateId  = '#group-pane-0-'+(idx-1);
                            var childTree = parentTree.children[idx];
                            for (var cidx = 0 ; cidx < childTree.elements.length; cidx++) {
                                (function () {
                                    //if(idx == whichIndex) continue;


                                    var newId = childTree.elements[cidx].index;
                                    var newTemplateId = 'group-pane-sub-' + childTree.index + '-' + newId;
                                    var tempOldIdObject = $(childTree.elements[cidx].templateId);
                                    tempOldIdObject.attr('id', newTemplateId);

                                    newTemplateId = "#" + newTemplateId;

                                    tempOldIdObject.find('button').attr('data-target', newTemplateId);

                                    var tempName = tempOldIdObject.find('input[type="checkbox"]').attr('name');
                                    tempName = "quizzes[" + childTree.index + "][answers][" + newId + "][correct]";
                                    tempOldIdObject.find('input[type="checkbox"]').attr('name', tempName);

                                    var tempName = tempOldIdObject.find('input[type="text"]').attr('name');
                                    tempName = "quizzes[" + childTree.index + "][answers][" + newId + "][option]";
                                    tempOldIdObject.find('input[type="text"]').attr('name', tempName);


                                    childTree.elements[cidx].templateId = newTemplateId;


                                })();
                            }
                            if (idx == parentTree.children.length - 1) {
                                done(parentTree.children, whichIndex,'NodeTree');
                            }
                        })();
                    }

                }


            })(finalFn);


            //console.log(nodeTree);
        }


    },
    handleMouseClickFactory = function (e) {
        e.preventDefault();// @TODO use button type instead
        console.log('preventDefault');
        var target = e.currentTarget;
        var ObjectTarget = $(target).attr('data-target');

        switch ($(target).attr('data-action')) {
            case  'add':
                addChildNode(ObjectTarget);
                break;
            case  'remove':
                removeChildNode(ObjectTarget);
                break;
            default :
                break;
        }

        lastClick = e.target;

    },
    isArray = function (obj) {
        return Object.prototype.toString.apply(obj) === '[object Array]';
    };


exports.formBuild = function (options) {

    // each property in data
    // add new tab , add form, add submit button ,add elem button
    // each property in element , isArray
    // add panel element (eq. remove cur elem button)
    // each property in elem  isArray
    // add textArea , checkBox , or radiosGroup
    //
    //@TODO use extend fn.
    config.data = options.data;
    config.wrapper = options.wrapper;
    config.formBody = options.formBody;
    var data = config.data,
        questions = data['questions'];
    console.log("data.quizzes", data.quizzes);
    data = reformerData(data);

    var wrapper = $(config.formBody);

    var template = require('./../templates/quizzesForm.handlebars');

    buildReduce(data);

    var html = template(data);

    wrapper.append(html);


    reTemplate(function () {
        $('body').on('click', config.formBody + " button[type!='submit']", {lastClick: lastClick}, handleMouseClickFactory);

        wrapper.on('submit', function (e) {

            e.preventDefault();
            var form = $(config.formBody);

            var serializedArray;

            var ajaxURL = '';
            if (config.methodType == 'PUT') {
                ajaxURL = $(form).attr('action') + '/' + data.form.quizzes[0].quiz._id;
                console.log(JSON.stringify($(form).serialize()));
                //serializedArray = serializeJSON($(form).serializeArray());

            } else {
                ajaxURL = $(form).attr('action')
                //serializedArray = $(form).serialize();
            }
            serializedArray = $(form).serialize();
            $.ajax({
                type:config.methodType,
                url: ajaxURL,
                data: serializedArray,
                dataType: "json",
                success: function(json){
                    console.log(json);

                    $('#quizMsg ul').append($('<li> article '+json.art_id+' updated!</li>'))
                        .parent().show().fadeIn();

                },
                error:function(err){
                    console.log(err);
                }
            })


        });
    });


};


var serializeJSON = function (dataArray) {
    var serializedArray = {};
    var tempObjectId = "0";
    var temp2ObjectId = "0";
    var hasMatches, hasPropertyMatches;
    var tempObject = {};
    var temp2Object = {index: -1};




    var key, subKey, subId,subsKey;


    console.log("origin form data: ", dataArray);
    $.each(dataArray, function () {
        var matches = this.name.match(/^(.+?)\[(\d+)\]\[(.+)\]+$/i)
            , value = this.value;



        if (matches) {
            hasMatches = true;
            // serializedArray[key][subId]{pos, answers[]}
            subKey = matches[3];
            subId = matches[2];
            key = matches[1];



            if (!( key in  serializedArray)) {
                serializedArray[key] = [];
            }



            //tempObject.index = subId;

            var propertyMatches = subKey.match(/^(.+?)\]\[(\d+)\]\[(.+)+$/i);


            //console.log(propertyMatches);
            //@TODO if more deeper?


            if (propertyMatches) {
                hasPropertyMatches = true;
                subsKey = propertyMatches[1];
                var subsId = propertyMatches[2];
                var subsKeyName = propertyMatches[3];

                if (!( subsKey in  tempObject)) {
                    tempObject[subsKey] = [];
                }

//                if( !(subsId === temp2Object.index)){
//                    if(temp2Object.index!==-1) tempObject[subsKey].push(temp2Object);
//                    temp2Object = {};
//                    temp2Object.index = subsId;
//                }

                if (subsId !== temp2ObjectId) {
                    tempObject[subsKey].push(temp2Object);
                    temp2Object = {};
                    temp2ObjectId = subsId;
                }


                temp2Object[subsKeyName] = value;

            } else {
                hasPropertyMatches = false;
                tempObject[subKey] = value;
            }

            // start from subId.
            if (subId !== tempObjectId) {
                console.log(tempObjectId, subId);
                // insert and start to next loop



                serializedArray[key].push(tempObject);
                tempObject = {};
                tempObjectId = subId;
            }


        } else {
            hasMatches = true;

            serializedArray[this.name] = this.value || '';
        }

    });
    if (hasMatches) {
        if(hasPropertyMatches){
            console.log(temp2Object);
            tempObject[subsKey].push(temp2Object);
        }
        serializedArray[key].push(tempObject);
    }


    console.log('serializedArray++');
    console.dir(serializedArray);
    return serializedArray;
}
},{"./../../lib/example/quiz":6,"./../templates/quizzesForm.handlebars":5}],2:[function(require,module,exports){
exports.init= function(){
    $('#buildScorm').on('click',function(e){
        e.preventDefault();
        var aid = $(e.currentTarget).attr('data-target');
        var ajaxURL = '/scorm/'+aid+'/build';

        $.ajax({
            url: ajaxURL,
            success: function(json){
                console.log(json);
            },
            error:function(err){
                console.log(err);
            }
        })
    })
    $('#downloadSCORM').on('click',function(e){
        e.preventDefault();
        var aid = $(e.currentTarget).attr('data-target');
        var ajaxURL = '/scorm/'+aid+'/exportSCORM';

        $.ajax({
            url: ajaxURL,
            success: function(json){
                console.log(json);
            },
            error:function(err){
                console.log(err);
            }
        })
    })

}
},{}],3:[function(require,module,exports){
//Module.exports= function(){
//define('_forms/_videosForm', ['exports'], function(__exports___){
exports.videoInit= function(){
    $(document).ready(function () {

        // @TODO  refactor
        /*
         * {
         *   wrapper_name,
         *   group_name,
         *   property_name,
         *   button_id,
         *   button_data-target_index
         *   control_id
         *   form_element_tagName
         *   form_id
         * }
         * */
        $(document).on('click','button.remove-video-btn',{}, removeVideoFn);

        $(document).on('click','button.remove-video-btn',{}, removeVideoFn);

        //$('button.remove-video-btn').on('click',removeVideoFn);
        // jquery 1.7
        //$('.remove-video-btn').live('click', removeVideoFn);



        $('#videoForm #add').on('click', function(e){
            e.preventDefault();
            //@TODO first with append.
            var count = $('.video-group').length;
            var template =$('.video-group').first().clone();
            $(template).children('.crud-video-control').toggleClass('hide').children();
            var elements = $(template).children().children().children("[name^='videos']");
            var button = $(template).children('.crud-video-control').children().children(' button')
            button.attr('id','temp-video-id');
            button.attr('data-target',count);
            elements.each(function(idx, ele){
                var attr_name = $(ele).attr('name');
                var word_star_at = attr_name.indexOf('[');
                var word_end_at = attr_name.indexOf(']');
                var new_attr_name =attr_name.substr(0, word_star_at+1)+count+ attr_name.substr(word_end_at);

                $(ele).attr('name', new_attr_name);

                if($(ele).is('textarea')){
                    $(ele).empty();
                }
                if($(ele).is('input')){
                    $(ele).val('');
                }
            });

            $('#videos-group').append(template);
        });

        $("#videoForm button[type='submit']").on('click',function(e){
            var form = $('#videoForm');
            var data =$(form).serialize();

            $.ajax({
                url: $(form).attr('action'),
                data: data,
                success: function(json){
                    flash('success update video.');

                }
            })
        });
//        $('#videoForm').on('submit', function(e){
//            e.preventDefault();
//        });


    });


    var flash=function(message){
    //    $('.main-content').prepend($('.fade.in.alert-info'))

    //        .fade.in.alert.alert-danger
        //    button.close(type='button', data-dismiss='alert') ×
        //    ul
        //    - each error in errors
        //    li!= error
    }


    var removeVideoFn = function(e){
        e.preventDefault();
        var target = e.target;
        var currentIndex= $(target).attr('data-target');
        console.log($(target).attr('id'));

        if('temp-video-id' == $(target).attr('id') ){
            $('.video-group')[currentIndex].remove();
        }else{
            var form = $('#videoForm');
            var videoId = $(target).attr('id');
            $.ajax({
                url: $(form).attr('action')+ "/"+videoId,
                type:'DELETE',
                headers: {
                    'X-CSRF-Token': $('[name="_csrf"]').val()
                },

                success: function(json){
                    $('.video-group')[currentIndex].remove();
                }
            });
        }

        // recount
        $('.video-group').each(function(idx, child){

            var target = $(child).children().children().children("[name^='videos']");
            target.each(function(i,ele){
                var attr_name = $(ele).attr('name');
                var word_star_at = attr_name.indexOf('[');
                var word_end_at = attr_name.indexOf(']');
                var new_attr_name =attr_name.substr(0, word_star_at+1)+idx+ attr_name.substr(word_end_at);

                $(ele).attr('name', new_attr_name);

            });
            var remove_btn = $(child).children('.crud-video-control').children().children(' button');
            remove_btn.attr('data-target',idx);

        });
    }
//}
//});
}
},{}],4:[function(require,module,exports){
//define('_forms/_videosForm', ['exports'], function(__exports___){
//   console.log(__exports___);
//    __exports___();
//});
//
//
$(document).ready(function () {

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });


});
// @TODO will concat file with gulp in the future
//$.getScript(domain.scriptPath+"_forms/_videosForm.js", function(){
//    //require('./_forms/_videosForm');
//});

//require handlebars

// @TODO dup in gulp
require('./../lib/helpers/handlebars-helpers');

require('./_forms/_videosForm.js').videoInit();

//require('./templates/quizzesForm.handlebars');
//MyApp = window['MyApp'] ||{};
//MyApp.templates = window['MyApp'].templates || {};

MyApp = window['MyApp'] ||{};
MyApp = require('./_forms/_quizzesForm.js');

function flash(msg){

}

if($('#buildScorm').length){
    require('./_forms/_scromForm.js').init();
}

},{"./../lib/helpers/handlebars-helpers":7,"./_forms/_quizzesForm.js":1,"./_forms/_scromForm.js":2,"./_forms/_videosForm.js":3}],5:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n\n    <div class=\"quiz-group\" data-target=\""
    + escapeExpression((helper = helpers.setIndex || (depth0 && depth0.setIndex),options={hash:{},data:data},helper ? helper.call(depth0, (data == null || data === false ? data : data.index), options) : helperMissing.call(depth0, "setIndex", (data == null || data === false ? data : data.index), options)))
    + "\">\n      <div class=\"\">\n          <ul class=\"nav nav-pills group-nav\" id=\"quizzes-groups-nav\">\n            ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.quiz)),stack1 == null || stack1 === false ? stack1 : stack1.questions), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              <span class=\" pull-right\">\n                  <button id=\"add\" data-target=\"#quizzes-groups-nav\" data-action=\"add\"\n                          class=\"btn btn-primary group-pane-add-btn\">Add Question</button>\n              </span>\n          </ul>\n          \n          \n          \n      </div>\n      <div class=\"tab-content group-wrapper\" id=\"quizzes-group-0\">\n        ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.quiz)),stack1 == null || stack1 === false ? stack1 : stack1.questions), {hash:{},inverse:self.noop,fn:self.programWithDepth(5, program5, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n      </div>\n\n    </div>\n  ";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                <li  class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isActive), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" id=\"group-nav-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                    <a data-toggle=\"tab\" href=\"#group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" title=\"";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">"
    + escapeExpression((helper = helpers.setIndex || (depth0 && depth0.setIndex),options={hash:{},data:data},helper ? helper.call(depth0, (data == null || data === false ? data : data.index), options) : helperMissing.call(depth0, "setIndex", (data == null || data === false ? data : data.index), options)))
    + "</a>\n                </li>\n            ";
  return buffer;
  }
function program3(depth0,data) {
  
  
  return "active";
  }

function program5(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"tab-pane ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isActive), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " group-pane\" id=\"group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                <div class=\"\">\n                    <div class=\"form-group\">\n                        <label for=\"title\" class=\"col-sm-2 control-label\">Question:</label>\n\n                        <div class=\"col-sm-1 col-sm-offset-9\">\n                            <button type=\"button\" data-target=\"#group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-action=\"remove\"\n                                    class=\"close group-pane-remove-btn\" title=\" 1st would not be deleted!\">×</button>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <div class=\"col-sm-11 col-sm-offset-1\">\n\n                            <textarea rows=\"3\" name=\"quizzes["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][question]\"\n                                      placeholder=\"Enter the Question title\" class=\"form-control\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                            </textarea>\n                        </div>\n                    </div>\n                    <div class=\"options-group col-sm-offset-1\" id=\"options-group-pane-sub-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-wrapper\">\n\n                       ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.answers), {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n                    </div>\n                    <div class=\"form-group crud-option-control\">\n                        <div class=\"col-sm-10 col-sm-offset-2\">\n                            <button data-target=\"#group-pane-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-0\"  data-action=\"add\"\n                                    class=\"btn btn-info pull-right group-pane-sub-add-btn\">\n                                add an option\n                            </button>\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"correct\" class=\"col-sm-3 control-label\">Correct</label>\n\n                        <div class=\"col-sm-9\">\n                            <textarea rows=\"2\" name=\"quizzes["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][correct]\"\n                                      placeholder=\"If Correct : \" class=\"form-control\">";
  if (helper = helpers.correct) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.correct); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                            </textarea>\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"incorrect\" class=\"col-sm-3 control-label\">Incorrect</label>\n\n                        <div class=\"col-sm-9\">\n                            <textarea rows=\"2\" name=\"quizzes["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][incorrect]\"\n                                      placeholder=\"If incorrect : \" class=\"form-control\">";
  if (helper = helpers.incorrect) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.incorrect); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                            </textarea>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ";
  return buffer;
  }
function program6(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                          <div class=\"option-group group-pane-sub\" id=\"group-pane-sub-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                              <div class=\"form-group\">\n                                  <label for=\"option\" class=\"col-sm-2 control-label\">Option :</label>\n\n                                  <div class=\"col-sm-9\">\n                                      <input type=\"text\" name=\"quizzes["
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][answers]["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][option]\"\n                                             value=\"";
  if (helper = helpers.option) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.option); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"\n                                             placeholder=\"Enter option title\" class=\"form-control\">\n                                  </div>\n                                  <div class=\"col-sm-1\">\n                                      <button type=\"button\" data-target=\"#group-pane-sub-"
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\n                                              data-action=\"remove\" class=\"close group-pane-sub-remove-btn\">×</button>\n                                  </div>\n                              </div>\n                              <div class=\"form-group\">\n                                  <div class=\"col-sm-9 col-sm-offset-2\">\n                                      <input type=\"checkbox\" name=\"quizzes["
    + escapeExpression(((stack1 = (depth1 && depth1.oindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][answers]["
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "][correct]\"\n                                             placeholder=\"Correct ? \"\n                                        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.correct), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " >\n                                      <label for=\"correctBool\" class=\"control-label\">Correct ?</label>\n                                  </div>\n                              </div>\n                          </div>\n                       ";
  return buffer;
  }
function program7(depth0,data) {
  
  
  return " checked ";
  }

  buffer += "<div id=\"quizzes-groups\">\n    <div class=\" alert alert-info\" id=\"quizMsg\" style=\"display:none;\">\n        <button type=\"button\" data-dismiss=\"alert\" class=\"close\">×</button>\n        <ul>\n            <li>Quiz Added!</li>\n        </ul>\n    </div>\n  ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.form)),stack1 == null || stack1 === false ? stack1 : stack1.quizzes), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<div class=\"form-group crud-quiz-control\">\n\n    <div class=\"col-sm-10\">\n        <hr/>\n\n        <button type=\"submit\" class=\"btn btn-primary\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.form)),stack1 == null || stack1 === false ? stack1 : stack1.actionName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</button>\n        &nbsp;<a href=\"/articles\" title=\"cancel\" class=\"btn\">Cancel</a>\n\n    </div>\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":15}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){

var Handlebars = require('hbsfy/runtime');
Handlebars.registerHelper('setIndex', function(value){
    this.oindex = value;     // @TODO some time ../index can't work?
    this.hindex = Number(value + 1); //I needed human readable index, not zero based
    return this.hindex;
});

Handlebars.registerHelper('lookup', function(obj, field){
    return obj[field];
})
},{"hbsfy/runtime":15}],8:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":9,"./handlebars/exception":10,"./handlebars/runtime":11,"./handlebars/safe-string":12,"./handlebars/utils":13}],9:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":10,"./utils":13}],10:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],11:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":9,"./exception":10,"./utils":13}],12:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],13:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":12}],14:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":8}],15:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":14}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2NsaWVudC9fZm9ybXMvX3F1aXp6ZXNGb3JtLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2NsaWVudC9fZm9ybXMvX3Njcm9tRm9ybS5qcyIsIi9Vc2Vycy93Y3dlYi9Eb2N1bWVudHMvZGV2ZWxvcGVyL25vZGVqcy9DaGlzaGlraS9jbGllbnQvX2Zvcm1zL192aWRlb3NGb3JtLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2NsaWVudC9hcHAuanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvY2xpZW50L3RlbXBsYXRlcy9xdWl6emVzRm9ybS5oYW5kbGViYXJzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL2xpYi9leGFtcGxlL3F1aXouanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbGliL2hlbHBlcnMvaGFuZGxlYmFycy1oZWxwZXJzLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi9Vc2Vycy93Y3dlYi9Eb2N1bWVudHMvZGV2ZWxvcGVyL25vZGVqcy9DaGlzaGlraS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvd2N3ZWIvRG9jdW1lbnRzL2RldmVsb3Blci9ub2RlanMvQ2hpc2hpa2kvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy91dGlscy5qcyIsIi9Vc2Vycy93Y3dlYi9Eb2N1bWVudHMvZGV2ZWxvcGVyL25vZGVqcy9DaGlzaGlraS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL3djd2ViL0RvY3VtZW50cy9kZXZlbG9wZXIvbm9kZWpzL0NoaXNoaWtpL25vZGVfbW9kdWxlcy9oYnNmeS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBleGFtcGxlID0gcmVxdWlyZSgnLi8uLi8uLi9saWIvZXhhbXBsZS9xdWl6JykucXVpejtcblxuXG4vKlxuIHtcbiBxdWl6OntcbiBfaWQ6XG4gaW5kZXg6XG4gaXNBY3RpdmU6IHRydWUsXG4gcXVlc3Rpb246IHsgdHlwZSA6IFN0cmluZywgZGVmYXVsdCA6ICcnLCB0cmltIDogdHJ1ZX0sXG4gYW5zd2VyczogW3tcbiBfaWQ6XG4gaW5kZXg6XG4gb3B0aW9uIDogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQgOiAnJywgdHJpbSA6IHRydWV9LFxuIGNvcnJlY3Q6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdCA6IGZhbHNlIH1cbiB9XSxcbiBjb3JyZWN0OiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdCA6ICcnLCB0cmltIDogdHJ1ZX0sXG4gaW5jb3JyZWN0OiB7IHR5cGU6IEJvb2xlYW4sIGRlZmF1bHQgOiBmYWxzZSB9XG4gfVxuIH1cblxuXG4ge1xuIGFjdGlvbjogW1xuIGFkZDoge1xuIHdoaWNoIHBhcmVudFxuIH0sXG4gcmVtb3ZlOiB7XG4gd2hpY2ggbm9kZVxuIH1cbiBdLFxuIHJlaW5kZXg6IGZ1bmN0aW9uXG4gfVxuICovXG5cbnZhciBOb2RlVHJlZSA9IGZ1bmN0aW9uIE5vZGVUcmVlKHBhcmVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB7fTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUlkID0gXCJcIjtcblxuICAgICAgICBpZiAocGFyZW50KXtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgcGFyZW50LmFkZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAsIE5vZGVFbGVtZW50ID0gZnVuY3Rpb24gTm9kZUVsZW1lbnQodGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICB0aGlzLnRlbXBsYXRlSWQgPSBcIlwiO1xuICAgICAgICB0aGlzLmluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMucGFyZW50ID0ge307XG4gICAgfTtcblxuXG5Ob2RlVHJlZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ05vZGVFbGVtZW50Jykge1xuICAgICAgICBjaGlsZC5pbmRleCA9dGhpcy5lbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIHRoaXMuZWxlbWVudHMucHVzaChjaGlsZCk7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG5cbiAgICB9XG4gICAgaWYgKGNoaWxkLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ05vZGVUcmVlJykge1xuXG4gICAgICAgIGNoaWxkLmluZGV4ID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG5cbiAgICB9XG5cbiAgICAvL0BUT0RPXG4gICAgLy8kKHRoaXMudGVtcGxhdGUpLmFwcGVuZChjaGlsZC50ZW1wbGF0ZSk7XG59XG5cblxuTm9kZVRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpZHgsIGNoaWxkVHlwZSkge1xuICAgIGlmIChjaGlsZFR5cGUgPT0gXCJOb2RlVHJlZVwiKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIHZhciBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IGlkeDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmluZGV4IC09IDE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy9AVE9ET1xuICAgIC8vJCh0aGlzLnRlbXBsYXRlKS5yZW1vdmUoY2hpbGQudGVtcGxhdGUpO1xufVxuXG5Ob2RlRWxlbWVudC5wcm90b3R5cGUuc2V0SW5kZXggPSBmdW5jdGlvbiAoaWR4KSB7XG4gICAgdGhpcy5pbmRleCA9IGlkeDtcbn1cblxuXG4vL1xuLy92YXIgbnQgPSBuZXcgTm9kZVRyZWUobnVsbCk7XG4vL3ZhciBudDIgPSBuZXcgTm9kZVRyZWUobnVsbCk7XG4vL1xuLy92YXIgbm50ID0gbmV3IE5vZGVUcmVlKG50KTtcbi8vbnQuYWRkKG5udCk7XG4vL250LmFkZChubnQpO1xuLy9jb25zb2xlLmxvZyhudC5jaGlsZHJlbi5sZW5ndGgpO1xuLy92YXIgZWxlID0gbmV3IE5vZGVFbGVtZW50KCdzc3NzcycpO1xuLy9cbi8vbnQuYWRkKGVsZSk7XG4vL250LnJlbW92ZSgxLG5udC5jb25zdHJ1Y3Rvci5uYW1lKTtcbi8vY29uc29sZS5sb2cobnQuY2hpbGRyZW4ubGVuZ3RoKTtcbi8vbnQuYWRkKG5ldyBOb2RlRWxlbWVudCgnc3Nzc3MyJykpO1xuLy9jb25zb2xlLmxvZygnYWZ0ZXInLGVsZSk7XG4vL2NvbnNvbGUuZGlyKG50LnRvU3RyaW5nKCkpO1xuLy9jb25zb2xlLmxvZyhcImNvbnN0cnVjdG9yXCIsbnQuY29uc3RydWN0b3IubmFtZS50b1N0cmluZygpKTtcbi8vY29uc29sZS5sb2cobnQpO1xuXG5cbnZhciBjb25maWcgPSB7XG4gICAgICAgIGRhdGE6IHt9LFxuICAgICAgICBtZXRob2RUeXBlOiAnR0VUJyxcbiAgICAgICAgd3JhcHBlcjogJ2JvZHknXG4gICAgfSwgbGFzdENsaWNrID0ge30sIG5vZGVUcmVlLFxuICAgIHJlZm9ybWVyRGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cblxuICAgICAgICBkYXRhWydhY3Rpb25OYW1lJ10gPSBkYXRhLnF1aXp6ZXMubGVuZ3RoID4gMCA/IFwiVXBkYXRlXCIgOiBcIlNhdmVcIjtcblxuICAgICAgICBpZiAoIWRhdGEucXVpenplcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBkZW1vUXVpeiA9IHtxdWl6OiBleGFtcGxlfTtcbiAgICAgICAgICAgIGRhdGEucXVpenplcy5wdXNoKGRlbW9RdWl6KTtcbiAgICAgICAgICAgIC8vY29uZmlnLm1ldGhvZFR5cGUgPSAnUE9TVCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcubWV0aG9kVHlwZSA9ICdQVVQnO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS5xdWl6emVzWzBdLnF1aXoucXVlc3Rpb25zWzBdLmlzQWN0aXZlID0gdHJ1ZTtcblxuXG4gICAgICAgIHJldHVybiB7Zm9ybTogZGF0YX07XG4gICAgfSxcblxuICAgIHJlVGVtcGxhdGUgPSBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICB2YXIgZGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgICAgICB2YXIgbnQgPSBuZXcgTm9kZVRyZWUobnVsbCk7XG4gICAgICAgIG50LnRlbXBsYXRlID0gJCgnI3F1aXp6ZXMtZ3JvdXAtMCcpO1xuICAgICAgICBudC50ZW1wbGF0ZUlkID0gJyNxdWl6emVzLWdyb3VwLTAnO1xuXG5cbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZGF0YS5xdWl6emVzWzBdLnF1aXoucXVlc3Rpb25zLmxlbmd0aDsgaWR4KyspIHtcbi8vICAgICAgICAgICAgZGF0YS5xdWl6emVzW2lkeF0uaW5kZXggPSBpZHg7ICAvLyBoYW5kbGViYXIgaGF2ZSBiZWVuIGFkZGVkIGhpbmRleCBhbiBvaW5kZXguXG4gICAgICAgICAgICAoZnVuY3Rpb24gKGlkeCwgbm9kZVRyZWUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBjaGlsZFRyZWUgPSBuZXcgTm9kZVRyZWUobm9kZVRyZWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNUID0gJCgnI2dyb3VwLXBhbmUtMC0nICsgaWR4KTtcbiAgICAgICAgICAgICAgICBjaGlsZFRyZWUudGVtcGxhdGUgPSBjVDtcbiAgICAgICAgICAgICAgICBjaGlsZFRyZWUudGVtcGxhdGVJZCA9ICcjZ3JvdXAtcGFuZS0wLScgKyBpZHg7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRRdWl6ID0gZGF0YS5xdWl6emVzWzBdLnF1aXoucXVlc3Rpb25zW2lkeF07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjdXJyZW50UXVpei5hbnN3ZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkRWxlbWVudFRlbXBsYXRlID0gJCgnI2dyb3VwLXBhbmUtc3ViLScgKyBpZHggKyAnLScgKyBqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZEVsZW1lbnQgPSBuZXcgTm9kZUVsZW1lbnQoJChjaGlsZEVsZW1lbnRUZW1wbGF0ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRFbGVtZW50LnRlbXBsYXRlSWQgPSAnI2dyb3VwLXBhbmUtc3ViLScgKyBpZHggKyAnLScgKyBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRUcmVlLmFkZChjaGlsZEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KShqKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pKGlkeCwgbnQpO1xuXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ3JlVGVtcGxhdGUnLCBudCk7XG4gICAgICAgIG5vZGVUcmVlID0gbnQ7XG5cbiAgICAgICAgbmV4dCgpO1xuICAgIH0sXG5cbiAgICBidWlsZFJlZHVjZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkYXRhW3Byb3BdO1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAvL2J1aWxkUmVkdWNlKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZENoaWxkTm9kZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgLy8gY2FzZSBpbmRleCA9PSAwIDogdGFiIHBhbmVsXG4gICAgICAgIC8vIGNhc2UgaW5kZXggPT0gMSA6IGdyb3Vwc1xuICAgICAgICAvLyBjYXNlIGluZGV4ID49MSA6IGdyb3VwXG5cbiAgICAgICAgLy8gY3JlYXRlIHRlbXBsYXRlIHdpdGggZGF0YS5wcm9wZXJ0eVxuICAgICAgICAvLyB0ZW1wbGF0ZSBhcHBlbmRcblxuICAgICAgICAvLyBjb21iaW5nIHRhcmdldCB3aXRoIGFjdGlvblxuICAgICAgICAvLyBldmVudHMgYmluZCB3aXRoIGJ1dHRvbi5cblxuXG4gICAgICAgIHZhciB0YXJnZXRTdHJpbmcgPSB0YXJnZXQ7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldFN0cmluZyk7XG4gICAgICAgIGlmICh0YXJnZXRTdHJpbmcuaW5kZXhPZignbmF2JykgPj0gMCkge1xuICAgICAgICAgICAgLy8gaGFuZGxlIHRyZWUgbm9kZSBub3cuXG5cbiAgICAgICAgICAgIHZhciBjbG9uZU5vZGUgPSBub2RlVHJlZS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5vZGVUcmVlLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBjbG9uZU5vZGUucGFyZW50O1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlQ2xvbmUgPSBnZXRFbXB0eU5vZGVUZW1wbGF0ZSgkKHBhcmVudC5jaGlsZHJlblswXS50ZW1wbGF0ZUlkKS5jbG9uZSgpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGVtcGxhdGVDbG9uZVwiLHRlbXBsYXRlQ2xvbmUpO1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlTmF2Q2xvbmUgPSAoJCgnI3F1aXp6ZXMtZ3JvdXBzLW5hdiBsaScpLmZpcnN0KCkuY2xvbmUoKSk7XG4gICAgICAgICAgICB2YXIgbmV3SW5kZXggPSBwYXJlbnQuY2hpbGRyZW5bMF0udGVtcGxhdGVJZDsvLyAjc3ViLTAtMC0wLS4uLiAgd2hlbiBub2RlVHJlZS50ZW1wbGF0ZUlkID0nJztcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbkluZGV4ID0gcGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKG5ld0luZGV4LmluZGV4T2YoJyMnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBuZXdJbmRleC5zbGljZShuZXdJbmRleC5pbmRleE9mKCcjJykgKyAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4QXJyYXkgPSBuZXdJbmRleC5zcGxpdCgnLScpO1xuICAgICAgICAgICAgdmFyIG5ld0lkID0gJyc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluZGV4QXJyYXkubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbmV3SWQgKz0gaW5kZXhBcnJheVtpXSArIFwiLVwiO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIG5ld0lkICs9IGNoaWxkcmVuSW5kZXg7XG5cblxuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5hdHRyKCdpZCcsIG5ld0lkKTtcblxuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCcjb3B0aW9ucy1ncm91cC1wYW5lLXN1Yi0wLTAtd3JhcHBlciAuZ3JvdXAtcGFuZS1zdWInKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsZSkge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wSWQgPSAkKGVsZSkuYXR0cignaWQnKTtcbiAgICAgICAgICAgICAgICB2YXIgaWRBcnJheSA9IHRlbXBJZC5zcGxpdCgnLScpO1xuICAgICAgICAgICAgICAgICQoZWxlKS5maW5kKCdidXR0b24nKS5hdHRyKCdkYXRhLXRhcmdldCcsICcjZ3JvdXAtcGFuZS1zdWItJyArIGNoaWxkcmVuSW5kZXggKyAnLScgKyBpZHgpO1xuICAgICAgICAgICAgICAgICQoZWxlKS5hdHRyKCdpZCcsICdncm91cC1wYW5lLXN1Yi0nICsgY2hpbGRyZW5JbmRleCArICctJyArIGlkQXJyYXlbaWRBcnJheS5sZW5ndGggLSAxXSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGVtcE5hbWUgPSAkKGVsZSkuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIHRlbXBOYW1lID0gXCJxdWl6emVzW1wiICsgY2hpbGRyZW5JbmRleCArIFwiXVthbnN3ZXJzXVtcIiArIGlkeCArIFwiXVtjb3JyZWN0XVwiO1xuICAgICAgICAgICAgICAgICQoZWxlKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5hdHRyKCduYW1lJywgdGVtcE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBOYW1lID0gJChlbGUpLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIHRlbXBOYW1lID0gXCJxdWl6emVzW1wiICsgY2hpbGRyZW5JbmRleCArIFwiXVthbnN3ZXJzXVtcIiArIGlkeCArIFwiXVtvcHRpb25dXCI7XG4gICAgICAgICAgICAgICAgJChlbGUpLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hpbGRyZW5JbmRleCcsY2hpbGRyZW5JbmRleCk7XG4gICAgICAgICAgICAkKHRlbXBsYXRlQ2xvbmUpLmZpbmQoJy5ncm91cC1wYW5lLXN1Yi1hZGQtYnRuJylcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS10YXJnZXQnLCAnI2dyb3VwLXBhbmUtMC0nICsgY2hpbGRyZW5JbmRleCArICctMCcpO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCcuZ3JvdXAtcGFuZS1yZW1vdmUtYnRuJylcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS10YXJnZXQnLCcjZ3JvdXAtcGFuZS0wLScrY2hpbGRyZW5JbmRleCk7XG5cblxuXG5cbiAgICAgICAgICAgIHZhciBuZXdUcmVlID0gbmV3IE5vZGVUcmVlKCk7XG4gICAgICAgICAgICBuZXdUcmVlLmNoaWxkcmVuID0gcGFyZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuLnNsaWNlKDApO1xuICAgICAgICAgICAgbmV3VHJlZS5lbGVtZW50cyA9IHBhcmVudC5jaGlsZHJlblswXS5lbGVtZW50cy5zbGljZSgwKTtcblxuICAgICAgICAgICAgLy8gd2FsayB0aHJvdWdoIHRoZSBjbG9uZWQgdHJlZVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdUcmVlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gbmV3VHJlZS5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICB2YXIgaWRBcnJheSA9IGNoaWxkLnRlbXBsYXRlSWQuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICBpZEFycmF5W2lkQXJyYXkubGVuZ3RoIC0gMl0gPSBjaGlsZHJlbkluZGV4O1xuICAgICAgICAgICAgICAgIGNoaWxkLnRlbXBsYXRlSWQgPSBpZEFycmF5LmpvaW4oJy0nKTtcbiAgICAgICAgICAgICAgICBjaGlsZC50ZW1wbGF0ZSA9ICQoY2hpbGQudGVtcGxhdGVJZCk7XG4gICAgICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbmV3VHJlZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3VHJlZS5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbmV3VHJlZS5lbGVtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkQXJyYXkgPSBlbGVtZW50LnRlbXBsYXRlSWQuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgaWRBcnJheVtpZEFycmF5Lmxlbmd0aCAtIDJdID0gY2hpbGRyZW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50ZW1wbGF0ZUlkID0gaWRBcnJheS5qb2luKCctJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGVtcGxhdGUgPSAkKGVsZW1lbnQudGVtcGxhdGVJZCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50ID0gbmV3VHJlZTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgbmV3VHJlZS50ZW1wbGF0ZSA9ICQodGVtcGxhdGVDbG9uZSk7XG4gICAgICAgICAgICBuZXdUcmVlLnRlbXBsYXRlSWQgPSAnIycgKyBuZXdJZDtcblxuICAgICAgICAgICAgLy8gYXBwZW5kIG5hdiBsaVxuXG4gICAgICAgICAgICAkKCcjcXVpenplcy1ncm91cHMtbmF2IGxpJykuZWFjaChmdW5jdGlvbiAoaWR4LCBlbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJChlbGUpLmhhc0NsYXNzKCdhY3RpdmUnKSkgJChlbGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZU5hdkNsb25lKS5maW5kKCdhJykuaHRtbChjaGlsZHJlbkluZGV4ICsgMSkuYXR0cignaHJlZicsIG5ld1RyZWUudGVtcGxhdGVJZCk7XG4gICAgICAgICAgICAkKHRlbXBsYXRlTmF2Q2xvbmUpLmF0dHIoJ2lkJywnZ3JvdXAtbmF2LScrY2hpbGRyZW5JbmRleCk7XG5cblxuICAgICAgICAgICAgJCgnI3F1aXp6ZXMtZ3JvdXBzLW5hdicpLmFwcGVuZCh0ZW1wbGF0ZU5hdkNsb25lKTtcbi8vICAgICAgICAgICAgJCh0ZW1wbGF0ZU5hdkNsb25lKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vL1xuXG4gICAgICAgICAgICAvLyBhcHBlbmQgY29udGVudFxuLy8gICAgICAgICAgICAkKCcjcXVpenplcy1ncm91cC0wIC50YWItcGFuZScpLmVhY2goZnVuY3Rpb24gKGlkeCwgZWxlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAoJChlbGUpLmhhc0NsYXNzKCdhY3RpdmUnKSkgJChlbGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhcmVudC50ZW1wbGF0ZUlkKTtcblxuXG4gICAgICAgICAgICAkKHBhcmVudC50ZW1wbGF0ZUlkKS5hcHBlbmQobmV3VHJlZS50ZW1wbGF0ZSk7XG4gICAgICAgICAgICAvLyQobmV3VHJlZS50ZW1wbGF0ZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnI3F1aXp6ZXMtZ3JvdXBzLW5hdiBsaTplcSgnKyhjaGlsZHJlbkluZGV4KSsnKSBhJykudGFiKCdzaG93Jyk7XG4gICAgICAgICAgICBwYXJlbnQuYWRkKG5ld1RyZWUpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgZWxlbWVudCBub2RlIG5vdy5cbiAgICAgICAgICAgIHZhciB3aGljaE5vZGUgPSBnZXRDaGlsZE5vZGUodGFyZ2V0U3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aGljaCcsIHdoaWNoTm9kZSk7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gd2hpY2hOb2RlLnBhcmVudDtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUNsb25lID0gZ2V0RW1wdHlOb2RlVGVtcGxhdGUoJChwYXJlbnQuZWxlbWVudHNbMF0udGVtcGxhdGVJZCkuY2xvbmUoKSk7XG4gICAgICAgICAgICB2YXIgbmV3SW5kZXggPSBwYXJlbnQuZWxlbWVudHNbMF0udGVtcGxhdGVJZDtcbiAgICAgICAgICAgIHZhciBlbGVtZW50c0luZGV4ID0gcGFyZW50LmVsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKG5ld0luZGV4LmluZGV4T2YoJyMnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdpbmRleFwiLCBuZXdJbmRleC5pbmRleE9mKCcjJykpO1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gbmV3SW5kZXguc2xpY2UobmV3SW5kZXguaW5kZXhPZignIycpICsgMSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdpbmRleFwiLCBuZXdJbmRleCk7XG4gICAgICAgICAgICB2YXIgaW5kZXhBcnJheSA9IG5ld0luZGV4LnNwbGl0KCctJyk7XG4gICAgICAgICAgICB2YXIgbmV3SWQgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5kZXhBcnJheS5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICBuZXdJZCArPSBpbmRleEFycmF5W2ldICsgXCItXCI7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgbmV3SWQgKz0gZWxlbWVudHNJbmRleDtcblxuXG4gICAgICAgICAgICB2YXIgbmV3RWxlbWVudCA9IG5ldyBOb2RlRWxlbWVudCgpO1xuXG4gICAgICAgICAgICAvLyBzZXQgbmFtZSBhbmQgaWQgdG8gaW5wdXQuXG5cbiAgICAgICAgICAgICQodGVtcGxhdGVDbG9uZSkuYXR0cignaWQnLCBuZXdJZCkuZmluZCgnYnV0dG9uJykuYXR0cignZGF0YS10YXJnZXQnLCAnIycgKyBuZXdJZCk7XG5cbiAgICAgICAgICAgIHZhciB0ZW1wTmFtZSA9ICQodGVtcGxhdGVDbG9uZSkuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgdGVtcE5hbWUgPSBcInF1aXp6ZXNbXCIgKyBwYXJlbnQuaW5kZXggKyBcIl1bYW5zd2Vyc11bXCIgKyBlbGVtZW50c0luZGV4ICsgXCJdW2NvcnJlY3RdXCI7XG4gICAgICAgICAgICAkKHRlbXBsYXRlQ2xvbmUpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmF0dHIoJ25hbWUnLCB0ZW1wTmFtZSk7XG5cbiAgICAgICAgICAgIHZhciB0ZW1wTmFtZSA9ICQodGVtcGxhdGVDbG9uZSkuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0nKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICB0ZW1wTmFtZSA9IFwicXVpenplc1tcIiArIHBhcmVudC5pbmRleCArIFwiXVthbnN3ZXJzXVtcIiArIGVsZW1lbnRzSW5kZXggKyBcIl1bb3B0aW9uXVwiO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnLCB0ZW1wTmFtZSk7XG5cbiAgICAgICAgICAgIG5ld0VsZW1lbnQudGVtcGxhdGUgPSAkKHRlbXBsYXRlQ2xvbmUpO1xuXG4gICAgICAgICAgICBuZXdFbGVtZW50LnRlbXBsYXRlSWQgPSAnIycgKyBuZXdJZDtcblxuXG4gICAgICAgICAgICAkKHBhcmVudC50ZW1wbGF0ZUlkICsgJyAub3B0aW9ucy1ncm91cCcpLmFwcGVuZChuZXdFbGVtZW50LnRlbXBsYXRlKTtcbiAgICAgICAgICAgIHBhcmVudC5hZGQobmV3RWxlbWVudCk7XG5cbiAgICAgICAgfVxuXG5cbiAgICB9LFxuICAgIGdldEVtcHR5Tm9kZVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlQ2xvbmUpIHtcbiAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKCdpbnB1dCcpLnZhbCgnJykuYXR0cigndmFsdWUnLCAnJyk7XG4gICAgICAgICQodGVtcGxhdGVDbG9uZSkuZmluZCgndGV4dGFyZWEnKS5odG1sKCcnKTtcbiAgICAgICAgJCh0ZW1wbGF0ZUNsb25lKS5maW5kKFwiW3R5cGU9J2NoZWNrYm94J11cIikucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuICQodGVtcGxhdGVDbG9uZSk7XG4gICAgfSxcbiAgICBnZXRDaGlsZE5vZGUgPSBmdW5jdGlvbiAodGFyZ2V0U3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHRhcmdldFN0cmluZy5sYXN0SW5kZXhPZignc3ViJykgPj0gMClcbiAgICAgICAgICAgIHRhcmdldFN0cmluZyA9IHRhcmdldFN0cmluZy5zdWJzdHIodGFyZ2V0U3RyaW5nLmxhc3RJbmRleE9mKCdzdWItJykgKyA0KTtcblxuICAgICAgICBpZiAodGFyZ2V0U3RyaW5nLmluZGV4T2YoJ2dyb3VwLXBhbmUtMCcpID49IDApXG4gICAgICAgICAgICB0YXJnZXRTdHJpbmcgPSB0YXJnZXRTdHJpbmcuc3Vic3RyKHRhcmdldFN0cmluZy5pbmRleE9mKCdncm91cC1wYW5lLTAtJykgKyAxMyk7XG5cbiAgICAgICAgdmFyIGluZGV4QXJyYXkgPSB0YXJnZXRTdHJpbmcuc3BsaXQoJy0nKTtcblxuICAgICAgICB2YXIgc3RyaW5nVGFyZ2V0ID0gXCJub2RlVHJlZVwiO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5kZXhBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGluZGV4QXJyYXlbal0gIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaiAlIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nVGFyZ2V0ICs9IFwiLmVsZW1lbnRzW1wiICsgaW5kZXhBcnJheVtqXSArIFwiXVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ1RhcmdldCArPSBcIi5jaGlsZHJlbltcIiArIGluZGV4QXJyYXlbal0gKyBcIl1cIjtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coc3RyaW5nVGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuICAgZXZhbChzdHJpbmdUYXJnZXQpO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGROb2RlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXG4gICAgICAgIC8vIHN1Yi0xLTIgIGxldmVsIDEgc2Vjb25kIG9uZS5cblxuICAgICAgICB2YXIgdGFyZ2V0cyA9ICQodGFyZ2V0KTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0cyk7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZmluYWxGbiA9IGZ1bmN0aW9uICh0cmVlQXJyYXksIHdoaWNoSW5kZXgsdHlwZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHdoaWNoSW5kZXggIT0gMCk7XG5cbiAgICAgICAgICAgICAgICBpZih3aGljaEluZGV4ICE9IDApe1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlID09ICdOb2RlVHJlZScpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYod2hpY2hJbmRleCA8IHRyZWVBcnJheS5sZW5ndGgtMSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcXVpenplcy1ncm91cHMtbmF2IGxpOmVxKCcrd2hpY2hJbmRleCsnKSBhJykudGFiKCdzaG93JylcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYod2hpY2hJbmRleC0xID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3F1aXp6ZXMtZ3JvdXBzLW5hdiBsaTplcSgnKyh3aGljaEluZGV4LTEpKycpIGEnKS50YWIoJ3Nob3cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3F1aXp6ZXMtZ3JvdXBzLW5hdiBsaTplcSgwKSBhJykudGFiKCdzaG93JylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRyZWVBcnJheS5zcGxpY2Uod2hpY2hJbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRTdHJpbmcgPSAkKHRhcmdldHNbaV0pLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGFyZ2V0U3RyaW5nKTtcbiAgICAgICAgICAgICAgICB2YXIgd2hpY2hOb2RlID0gZ2V0Q2hpbGROb2RlKHRhcmdldFN0cmluZyk7XG4gICAgICAgICAgICAgICAgdmFyIHdoaWNoSW5kZXggPSB3aGljaE5vZGUuaW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudFRyZWUgPSB3aGljaE5vZGUucGFyZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHdoaWNoSW5kZXggIT09IDApICQoJ2RpdicpLnJlbW92ZSh3aGljaE5vZGUudGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgICAgICBpZih3aGljaE5vZGUuY29uc3RydWN0b3IubmFtZSA9PSAnTm9kZUVsZW1lbnQnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gd2hpY2hJbmRleCsxOyBpZHggPCBwYXJlbnRUcmVlLmVsZW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZihpZHggPT0gd2hpY2hJbmRleCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRUcmVlLmVsZW1lbnRzW2lkeF0uaW5kZXggPSBpZHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lkID0gaWR4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VGVtcGxhdGVJZCA9ICdncm91cC1wYW5lLXN1Yi0nICsgcGFyZW50VHJlZS5pbmRleCArICctJyArIG5ld0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wT2xkSWRPYmplY3QgPSAkKHBhcmVudFRyZWUuZWxlbWVudHNbaWR4XS50ZW1wbGF0ZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wT2xkSWRPYmplY3QuYXR0cignaWQnLCBuZXdUZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RlbXBsYXRlSWQgPSBcIiNcIiArIG5ld1RlbXBsYXRlSWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wT2xkSWRPYmplY3QuZmluZCgnYnV0dG9uJykuYXR0cignZGF0YS10YXJnZXQnLCBuZXdUZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wTmFtZSA9IHRlbXBPbGRJZE9iamVjdC5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE5hbWUgPSBcInF1aXp6ZXNbXCIgKyBwYXJlbnRUcmVlLmluZGV4ICsgXCJdW2Fuc3dlcnNdW1wiICsgbmV3SWQgKyBcIl1bY29ycmVjdF1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wT2xkSWRPYmplY3QuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wTmFtZSA9IHRlbXBPbGRJZE9iamVjdC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTmFtZSA9IFwicXVpenplc1tcIiArIHBhcmVudFRyZWUuaW5kZXggKyBcIl1bYW5zd2Vyc11bXCIgKyBuZXdJZCArIFwiXVtvcHRpb25dXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VHJlZS5lbGVtZW50c1tpZHhdLnRlbXBsYXRlSWQgPSBuZXdUZW1wbGF0ZUlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCA9PSBwYXJlbnRUcmVlLmVsZW1lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZShwYXJlbnRUcmVlLmVsZW1lbnRzLCB3aGljaEluZGV4LCdOb2RlRWxlbWVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZih3aGljaE5vZGUuY29uc3RydWN0b3IubmFtZSA9PSAnTm9kZVRyZWUnKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3doaWNoSW5kZXg6Jyx3aGljaEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYod2hpY2hJbmRleCAhPSAwKSAkKCcjZ3JvdXAtbmF2LScrd2hpY2hJbmRleCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gd2hpY2hJbmRleDsgaWR4IDwgcGFyZW50VHJlZS5jaGlsZHJlbi5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpZHggPT0gd2hpY2hJbmRleCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID09IHBhcmVudFRyZWUuY2hpbGRyZW4ubGVuZ3RoIC0gMSB8fCBpZHggPT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKHBhcmVudFRyZWUuY2hpbGRyZW4sIHdoaWNoSW5kZXgsJ05vZGVUcmVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmKGlkeCA9PSB3aGljaEluZGV4KSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZ3JvdXAtbmF2LScraWR4KS5jaGlsZHJlbignYScpLmh0bWwoaWR4KS5hdHRyKCdocmVmJywnI2dyb3VwLXBhbmUtMC0nKyhpZHgtMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNncm91cC1uYXYtJytpZHgpLmF0dHIoJ2lkJywnZ3JvdXAtbmF2LScrKGlkeC0xKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2dyb3VwLXBhbmUtMC0nK2lkeCkuYXR0cignaWQnLCdncm91cC1wYW5lLTAtJysoaWR4LTEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZ3JvdXAtcGFuZS0wLScraWR4KS5maW5kKCcuZ3JvdXAtcGFuZS1yZW1vdmUtYnRuJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdGFyZ2V0JywnI2dyb3VwLXBhbmUtMC0nKyhpZHgtMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFRyZWUuY2hpbGRyZW5baWR4XS5pbmRleCA9IGlkeC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFRyZWUuY2hpbGRyZW5baWR4XS50ZW1wbGF0ZUlkICA9ICcjZ3JvdXAtcGFuZS0wLScrKGlkeC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRUcmVlID0gcGFyZW50VHJlZS5jaGlsZHJlbltpZHhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGNpZHggPSAwIDsgY2lkeCA8IGNoaWxkVHJlZS5lbGVtZW50cy5sZW5ndGg7IGNpZHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZihpZHggPT0gd2hpY2hJbmRleCkgY29udGludWU7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0lkID0gY2hpbGRUcmVlLmVsZW1lbnRzW2NpZHhdLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1RlbXBsYXRlSWQgPSAnZ3JvdXAtcGFuZS1zdWItJyArIGNoaWxkVHJlZS5pbmRleCArICctJyArIG5ld0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBPbGRJZE9iamVjdCA9ICQoY2hpbGRUcmVlLmVsZW1lbnRzW2NpZHhdLnRlbXBsYXRlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmF0dHIoJ2lkJywgbmV3VGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RlbXBsYXRlSWQgPSBcIiNcIiArIG5ld1RlbXBsYXRlSWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBPbGRJZE9iamVjdC5maW5kKCdidXR0b24nKS5hdHRyKCdkYXRhLXRhcmdldCcsIG5ld1RlbXBsYXRlSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcE5hbWUgPSB0ZW1wT2xkSWRPYmplY3QuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE5hbWUgPSBcInF1aXp6ZXNbXCIgKyBjaGlsZFRyZWUuaW5kZXggKyBcIl1bYW5zd2Vyc11bXCIgKyBuZXdJZCArIFwiXVtjb3JyZWN0XVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmF0dHIoJ25hbWUnLCB0ZW1wTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wTmFtZSA9IHRlbXBPbGRJZE9iamVjdC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBOYW1lID0gXCJxdWl6emVzW1wiICsgY2hpbGRUcmVlLmluZGV4ICsgXCJdW2Fuc3dlcnNdW1wiICsgbmV3SWQgKyBcIl1bb3B0aW9uXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE9sZElkT2JqZWN0LmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykuYXR0cignbmFtZScsIHRlbXBOYW1lKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFRyZWUuZWxlbWVudHNbY2lkeF0udGVtcGxhdGVJZCA9IG5ld1RlbXBsYXRlSWQ7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID09IHBhcmVudFRyZWUuY2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lKHBhcmVudFRyZWUuY2hpbGRyZW4sIHdoaWNoSW5kZXgsJ05vZGVUcmVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH0pKGZpbmFsRm4pO1xuXG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cobm9kZVRyZWUpO1xuICAgICAgICB9XG5cblxuICAgIH0sXG4gICAgaGFuZGxlTW91c2VDbGlja0ZhY3RvcnkgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7Ly8gQFRPRE8gdXNlIGJ1dHRvbiB0eXBlIGluc3RlYWRcbiAgICAgICAgY29uc29sZS5sb2coJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIHZhciBPYmplY3RUYXJnZXQgPSAkKHRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcblxuICAgICAgICBzd2l0Y2ggKCQodGFyZ2V0KS5hdHRyKCdkYXRhLWFjdGlvbicpKSB7XG4gICAgICAgICAgICBjYXNlICAnYWRkJzpcbiAgICAgICAgICAgICAgICBhZGRDaGlsZE5vZGUoT2JqZWN0VGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgICdyZW1vdmUnOlxuICAgICAgICAgICAgICAgIHJlbW92ZUNoaWxkTm9kZShPYmplY3RUYXJnZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0Q2xpY2sgPSBlLnRhcmdldDtcblxuICAgIH0sXG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuXG5cbmV4cG9ydHMuZm9ybUJ1aWxkID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgIC8vIGVhY2ggcHJvcGVydHkgaW4gZGF0YVxuICAgIC8vIGFkZCBuZXcgdGFiICwgYWRkIGZvcm0sIGFkZCBzdWJtaXQgYnV0dG9uICxhZGQgZWxlbSBidXR0b25cbiAgICAvLyBlYWNoIHByb3BlcnR5IGluIGVsZW1lbnQgLCBpc0FycmF5XG4gICAgLy8gYWRkIHBhbmVsIGVsZW1lbnQgKGVxLiByZW1vdmUgY3VyIGVsZW0gYnV0dG9uKVxuICAgIC8vIGVhY2ggcHJvcGVydHkgaW4gZWxlbSAgaXNBcnJheVxuICAgIC8vIGFkZCB0ZXh0QXJlYSAsIGNoZWNrQm94ICwgb3IgcmFkaW9zR3JvdXBcbiAgICAvL1xuICAgIC8vQFRPRE8gdXNlIGV4dGVuZCBmbi5cbiAgICBjb25maWcuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICBjb25maWcud3JhcHBlciA9IG9wdGlvbnMud3JhcHBlcjtcbiAgICBjb25maWcuZm9ybUJvZHkgPSBvcHRpb25zLmZvcm1Cb2R5O1xuICAgIHZhciBkYXRhID0gY29uZmlnLmRhdGEsXG4gICAgICAgIHF1ZXN0aW9ucyA9IGRhdGFbJ3F1ZXN0aW9ucyddO1xuICAgIGNvbnNvbGUubG9nKFwiZGF0YS5xdWl6emVzXCIsIGRhdGEucXVpenplcyk7XG4gICAgZGF0YSA9IHJlZm9ybWVyRGF0YShkYXRhKTtcblxuICAgIHZhciB3cmFwcGVyID0gJChjb25maWcuZm9ybUJvZHkpO1xuXG4gICAgdmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi8uLi90ZW1wbGF0ZXMvcXVpenplc0Zvcm0uaGFuZGxlYmFycycpO1xuXG4gICAgYnVpbGRSZWR1Y2UoZGF0YSk7XG5cbiAgICB2YXIgaHRtbCA9IHRlbXBsYXRlKGRhdGEpO1xuXG4gICAgd3JhcHBlci5hcHBlbmQoaHRtbCk7XG5cblxuICAgIHJlVGVtcGxhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgY29uZmlnLmZvcm1Cb2R5ICsgXCIgYnV0dG9uW3R5cGUhPSdzdWJtaXQnXVwiLCB7bGFzdENsaWNrOiBsYXN0Q2xpY2t9LCBoYW5kbGVNb3VzZUNsaWNrRmFjdG9yeSk7XG5cbiAgICAgICAgd3JhcHBlci5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGZvcm0gPSAkKGNvbmZpZy5mb3JtQm9keSk7XG5cbiAgICAgICAgICAgIHZhciBzZXJpYWxpemVkQXJyYXk7XG5cbiAgICAgICAgICAgIHZhciBhamF4VVJMID0gJyc7XG4gICAgICAgICAgICBpZiAoY29uZmlnLm1ldGhvZFR5cGUgPT0gJ1BVVCcpIHtcbiAgICAgICAgICAgICAgICBhamF4VVJMID0gJChmb3JtKS5hdHRyKCdhY3Rpb24nKSArICcvJyArIGRhdGEuZm9ybS5xdWl6emVzWzBdLnF1aXouX2lkO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KCQoZm9ybSkuc2VyaWFsaXplKCkpKTtcbiAgICAgICAgICAgICAgICAvL3NlcmlhbGl6ZWRBcnJheSA9IHNlcmlhbGl6ZUpTT04oJChmb3JtKS5zZXJpYWxpemVBcnJheSgpKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhamF4VVJMID0gJChmb3JtKS5hdHRyKCdhY3Rpb24nKVxuICAgICAgICAgICAgICAgIC8vc2VyaWFsaXplZEFycmF5ID0gJChmb3JtKS5zZXJpYWxpemUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRBcnJheSA9ICQoZm9ybSkuc2VyaWFsaXplKCk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6Y29uZmlnLm1ldGhvZFR5cGUsXG4gICAgICAgICAgICAgICAgdXJsOiBhamF4VVJMLFxuICAgICAgICAgICAgICAgIGRhdGE6IHNlcmlhbGl6ZWRBcnJheSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICQoJyNxdWl6TXNnIHVsJykuYXBwZW5kKCQoJzxsaT4gYXJ0aWNsZSAnK2pzb24uYXJ0X2lkKycgdXBkYXRlZCE8L2xpPicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpLnNob3coKS5mYWRlSW4oKTtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxufTtcblxuXG52YXIgc2VyaWFsaXplSlNPTiA9IGZ1bmN0aW9uIChkYXRhQXJyYXkpIHtcbiAgICB2YXIgc2VyaWFsaXplZEFycmF5ID0ge307XG4gICAgdmFyIHRlbXBPYmplY3RJZCA9IFwiMFwiO1xuICAgIHZhciB0ZW1wMk9iamVjdElkID0gXCIwXCI7XG4gICAgdmFyIGhhc01hdGNoZXMsIGhhc1Byb3BlcnR5TWF0Y2hlcztcbiAgICB2YXIgdGVtcE9iamVjdCA9IHt9O1xuICAgIHZhciB0ZW1wMk9iamVjdCA9IHtpbmRleDogLTF9O1xuXG5cblxuXG4gICAgdmFyIGtleSwgc3ViS2V5LCBzdWJJZCxzdWJzS2V5O1xuXG5cbiAgICBjb25zb2xlLmxvZyhcIm9yaWdpbiBmb3JtIGRhdGE6IFwiLCBkYXRhQXJyYXkpO1xuICAgICQuZWFjaChkYXRhQXJyYXksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSB0aGlzLm5hbWUubWF0Y2goL14oLis/KVxcWyhcXGQrKVxcXVxcWyguKylcXF0rJC9pKVxuICAgICAgICAgICAgLCB2YWx1ZSA9IHRoaXMudmFsdWU7XG5cblxuXG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICBoYXNNYXRjaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHNlcmlhbGl6ZWRBcnJheVtrZXldW3N1YklkXXtwb3MsIGFuc3dlcnNbXX1cbiAgICAgICAgICAgIHN1YktleSA9IG1hdGNoZXNbM107XG4gICAgICAgICAgICBzdWJJZCA9IG1hdGNoZXNbMl07XG4gICAgICAgICAgICBrZXkgPSBtYXRjaGVzWzFdO1xuXG5cblxuICAgICAgICAgICAgaWYgKCEoIGtleSBpbiAgc2VyaWFsaXplZEFycmF5KSkge1xuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZWRBcnJheVtrZXldID0gW107XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAvL3RlbXBPYmplY3QuaW5kZXggPSBzdWJJZDtcblxuICAgICAgICAgICAgdmFyIHByb3BlcnR5TWF0Y2hlcyA9IHN1YktleS5tYXRjaCgvXiguKz8pXFxdXFxbKFxcZCspXFxdXFxbKC4rKSskL2kpO1xuXG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocHJvcGVydHlNYXRjaGVzKTtcbiAgICAgICAgICAgIC8vQFRPRE8gaWYgbW9yZSBkZWVwZXI/XG5cblxuICAgICAgICAgICAgaWYgKHByb3BlcnR5TWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIGhhc1Byb3BlcnR5TWF0Y2hlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3Vic0tleSA9IHByb3BlcnR5TWF0Y2hlc1sxXTtcbiAgICAgICAgICAgICAgICB2YXIgc3Vic0lkID0gcHJvcGVydHlNYXRjaGVzWzJdO1xuICAgICAgICAgICAgICAgIHZhciBzdWJzS2V5TmFtZSA9IHByb3BlcnR5TWF0Y2hlc1szXTtcblxuICAgICAgICAgICAgICAgIGlmICghKCBzdWJzS2V5IGluICB0ZW1wT2JqZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqZWN0W3N1YnNLZXldID0gW107XG4gICAgICAgICAgICAgICAgfVxuXG4vLyAgICAgICAgICAgICAgICBpZiggIShzdWJzSWQgPT09IHRlbXAyT2JqZWN0LmluZGV4KSl7XG4vLyAgICAgICAgICAgICAgICAgICAgaWYodGVtcDJPYmplY3QuaW5kZXghPT0tMSkgdGVtcE9iamVjdFtzdWJzS2V5XS5wdXNoKHRlbXAyT2JqZWN0KTtcbi8vICAgICAgICAgICAgICAgICAgICB0ZW1wMk9iamVjdCA9IHt9O1xuLy8gICAgICAgICAgICAgICAgICAgIHRlbXAyT2JqZWN0LmluZGV4ID0gc3Vic0lkO1xuLy8gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHN1YnNJZCAhPT0gdGVtcDJPYmplY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqZWN0W3N1YnNLZXldLnB1c2godGVtcDJPYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB0ZW1wMk9iamVjdCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB0ZW1wMk9iamVjdElkID0gc3Vic0lkO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgdGVtcDJPYmplY3Rbc3Vic0tleU5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFzUHJvcGVydHlNYXRjaGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGVtcE9iamVjdFtzdWJLZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0YXJ0IGZyb20gc3ViSWQuXG4gICAgICAgICAgICBpZiAoc3ViSWQgIT09IHRlbXBPYmplY3RJZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlbXBPYmplY3RJZCwgc3ViSWQpO1xuICAgICAgICAgICAgICAgIC8vIGluc2VydCBhbmQgc3RhcnQgdG8gbmV4dCBsb29wXG5cblxuXG4gICAgICAgICAgICAgICAgc2VyaWFsaXplZEFycmF5W2tleV0ucHVzaCh0ZW1wT2JqZWN0KTtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqZWN0ID0ge307XG4gICAgICAgICAgICAgICAgdGVtcE9iamVjdElkID0gc3ViSWQ7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFzTWF0Y2hlcyA9IHRydWU7XG5cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRBcnJheVt0aGlzLm5hbWVdID0gdGhpcy52YWx1ZSB8fCAnJztcbiAgICAgICAgfVxuXG4gICAgfSk7XG4gICAgaWYgKGhhc01hdGNoZXMpIHtcbiAgICAgICAgaWYoaGFzUHJvcGVydHlNYXRjaGVzKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlbXAyT2JqZWN0KTtcbiAgICAgICAgICAgIHRlbXBPYmplY3Rbc3Vic0tleV0ucHVzaCh0ZW1wMk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VyaWFsaXplZEFycmF5W2tleV0ucHVzaCh0ZW1wT2JqZWN0KTtcbiAgICB9XG5cblxuICAgIGNvbnNvbGUubG9nKCdzZXJpYWxpemVkQXJyYXkrKycpO1xuICAgIGNvbnNvbGUuZGlyKHNlcmlhbGl6ZWRBcnJheSk7XG4gICAgcmV0dXJuIHNlcmlhbGl6ZWRBcnJheTtcbn0iLCJleHBvcnRzLmluaXQ9IGZ1bmN0aW9uKCl7XG4gICAgJCgnI2J1aWxkU2Nvcm0nKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBhaWQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICAgICAgdmFyIGFqYXhVUkwgPSAnL3Njb3JtLycrYWlkKycvYnVpbGQnO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGFqYXhVUkwsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihqc29uKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhqc29uKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcbiAgICAkKCcjZG93bmxvYWRTQ09STScpLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGFpZCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgICAgICB2YXIgYWpheFVSTCA9ICcvc2Nvcm0vJythaWQrJy9leHBvcnRTQ09STSc7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYWpheFVSTCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGpzb24pe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxuXG59IiwiLy9Nb2R1bGUuZXhwb3J0cz0gZnVuY3Rpb24oKXtcbi8vZGVmaW5lKCdfZm9ybXMvX3ZpZGVvc0Zvcm0nLCBbJ2V4cG9ydHMnXSwgZnVuY3Rpb24oX19leHBvcnRzX19fKXtcbmV4cG9ydHMudmlkZW9Jbml0PSBmdW5jdGlvbigpe1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBAVE9ETyAgcmVmYWN0b3JcbiAgICAgICAgLypcbiAgICAgICAgICoge1xuICAgICAgICAgKiAgIHdyYXBwZXJfbmFtZSxcbiAgICAgICAgICogICBncm91cF9uYW1lLFxuICAgICAgICAgKiAgIHByb3BlcnR5X25hbWUsXG4gICAgICAgICAqICAgYnV0dG9uX2lkLFxuICAgICAgICAgKiAgIGJ1dHRvbl9kYXRhLXRhcmdldF9pbmRleFxuICAgICAgICAgKiAgIGNvbnRyb2xfaWRcbiAgICAgICAgICogICBmb3JtX2VsZW1lbnRfdGFnTmFtZVxuICAgICAgICAgKiAgIGZvcm1faWRcbiAgICAgICAgICogfVxuICAgICAgICAgKiAqL1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCdidXR0b24ucmVtb3ZlLXZpZGVvLWJ0bicse30sIHJlbW92ZVZpZGVvRm4pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsJ2J1dHRvbi5yZW1vdmUtdmlkZW8tYnRuJyx7fSwgcmVtb3ZlVmlkZW9Gbik7XG5cbiAgICAgICAgLy8kKCdidXR0b24ucmVtb3ZlLXZpZGVvLWJ0bicpLm9uKCdjbGljaycscmVtb3ZlVmlkZW9Gbik7XG4gICAgICAgIC8vIGpxdWVyeSAxLjdcbiAgICAgICAgLy8kKCcucmVtb3ZlLXZpZGVvLWJ0bicpLmxpdmUoJ2NsaWNrJywgcmVtb3ZlVmlkZW9Gbik7XG5cblxuXG4gICAgICAgICQoJyN2aWRlb0Zvcm0gI2FkZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy9AVE9ETyBmaXJzdCB3aXRoIGFwcGVuZC5cbiAgICAgICAgICAgIHZhciBjb3VudCA9ICQoJy52aWRlby1ncm91cCcpLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9JCgnLnZpZGVvLWdyb3VwJykuZmlyc3QoKS5jbG9uZSgpO1xuICAgICAgICAgICAgJCh0ZW1wbGF0ZSkuY2hpbGRyZW4oJy5jcnVkLXZpZGVvLWNvbnRyb2wnKS50b2dnbGVDbGFzcygnaGlkZScpLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSAkKHRlbXBsYXRlKS5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oXCJbbmFtZV49J3ZpZGVvcyddXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9ICQodGVtcGxhdGUpLmNoaWxkcmVuKCcuY3J1ZC12aWRlby1jb250cm9sJykuY2hpbGRyZW4oKS5jaGlsZHJlbignIGJ1dHRvbicpXG4gICAgICAgICAgICBidXR0b24uYXR0cignaWQnLCd0ZW1wLXZpZGVvLWlkJyk7XG4gICAgICAgICAgICBidXR0b24uYXR0cignZGF0YS10YXJnZXQnLGNvdW50KTtcbiAgICAgICAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oaWR4LCBlbGUpe1xuICAgICAgICAgICAgICAgIHZhciBhdHRyX25hbWUgPSAkKGVsZSkuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIHZhciB3b3JkX3N0YXJfYXQgPSBhdHRyX25hbWUuaW5kZXhPZignWycpO1xuICAgICAgICAgICAgICAgIHZhciB3b3JkX2VuZF9hdCA9IGF0dHJfbmFtZS5pbmRleE9mKCddJyk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld19hdHRyX25hbWUgPWF0dHJfbmFtZS5zdWJzdHIoMCwgd29yZF9zdGFyX2F0KzEpK2NvdW50KyBhdHRyX25hbWUuc3Vic3RyKHdvcmRfZW5kX2F0KTtcblxuICAgICAgICAgICAgICAgICQoZWxlKS5hdHRyKCduYW1lJywgbmV3X2F0dHJfbmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZigkKGVsZSkuaXMoJ3RleHRhcmVhJykpe1xuICAgICAgICAgICAgICAgICAgICAkKGVsZSkuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoJChlbGUpLmlzKCdpbnB1dCcpKXtcbiAgICAgICAgICAgICAgICAgICAgJChlbGUpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyN2aWRlb3MtZ3JvdXAnKS5hcHBlbmQodGVtcGxhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKFwiI3ZpZGVvRm9ybSBidXR0b25bdHlwZT0nc3VibWl0J11cIikub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHZhciBmb3JtID0gJCgnI3ZpZGVvRm9ybScpO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSQoZm9ybSkuc2VyaWFsaXplKCk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAkKGZvcm0pLmF0dHIoJ2FjdGlvbicpLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbil7XG4gICAgICAgICAgICAgICAgICAgIGZsYXNoKCdzdWNjZXNzIHVwZGF0ZSB2aWRlby4nKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuLy8gICAgICAgICQoJyN2aWRlb0Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSl7XG4vLyAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICB9KTtcblxuXG4gICAgfSk7XG5cblxuICAgIHZhciBmbGFzaD1mdW5jdGlvbihtZXNzYWdlKXtcbiAgICAvLyAgICAkKCcubWFpbi1jb250ZW50JykucHJlcGVuZCgkKCcuZmFkZS5pbi5hbGVydC1pbmZvJykpXG5cbiAgICAvLyAgICAgICAgLmZhZGUuaW4uYWxlcnQuYWxlcnQtZGFuZ2VyXG4gICAgICAgIC8vICAgIGJ1dHRvbi5jbG9zZSh0eXBlPSdidXR0b24nLCBkYXRhLWRpc21pc3M9J2FsZXJ0Jykgw5dcbiAgICAgICAgLy8gICAgdWxcbiAgICAgICAgLy8gICAgLSBlYWNoIGVycm9yIGluIGVycm9yc1xuICAgICAgICAvLyAgICBsaSE9IGVycm9yXG4gICAgfVxuXG5cbiAgICB2YXIgcmVtb3ZlVmlkZW9GbiA9IGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleD0gJCh0YXJnZXQpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCQodGFyZ2V0KS5hdHRyKCdpZCcpKTtcblxuICAgICAgICBpZigndGVtcC12aWRlby1pZCcgPT0gJCh0YXJnZXQpLmF0dHIoJ2lkJykgKXtcbiAgICAgICAgICAgICQoJy52aWRlby1ncm91cCcpW2N1cnJlbnRJbmRleF0ucmVtb3ZlKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdmFyIGZvcm0gPSAkKCcjdmlkZW9Gb3JtJyk7XG4gICAgICAgICAgICB2YXIgdmlkZW9JZCA9ICQodGFyZ2V0KS5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICQoZm9ybSkuYXR0cignYWN0aW9uJykrIFwiL1wiK3ZpZGVvSWQsXG4gICAgICAgICAgICAgICAgdHlwZTonREVMRVRFJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdYLUNTUkYtVG9rZW4nOiAkKCdbbmFtZT1cIl9jc3JmXCJdJykudmFsKClcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbil7XG4gICAgICAgICAgICAgICAgICAgICQoJy52aWRlby1ncm91cCcpW2N1cnJlbnRJbmRleF0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWNvdW50XG4gICAgICAgICQoJy52aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24oaWR4LCBjaGlsZCl7XG5cbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKGNoaWxkKS5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oXCJbbmFtZV49J3ZpZGVvcyddXCIpO1xuICAgICAgICAgICAgdGFyZ2V0LmVhY2goZnVuY3Rpb24oaSxlbGUpe1xuICAgICAgICAgICAgICAgIHZhciBhdHRyX25hbWUgPSAkKGVsZSkuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIHZhciB3b3JkX3N0YXJfYXQgPSBhdHRyX25hbWUuaW5kZXhPZignWycpO1xuICAgICAgICAgICAgICAgIHZhciB3b3JkX2VuZF9hdCA9IGF0dHJfbmFtZS5pbmRleE9mKCddJyk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld19hdHRyX25hbWUgPWF0dHJfbmFtZS5zdWJzdHIoMCwgd29yZF9zdGFyX2F0KzEpK2lkeCsgYXR0cl9uYW1lLnN1YnN0cih3b3JkX2VuZF9hdCk7XG5cbiAgICAgICAgICAgICAgICAkKGVsZSkuYXR0cignbmFtZScsIG5ld19hdHRyX25hbWUpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciByZW1vdmVfYnRuID0gJChjaGlsZCkuY2hpbGRyZW4oJy5jcnVkLXZpZGVvLWNvbnRyb2wnKS5jaGlsZHJlbigpLmNoaWxkcmVuKCcgYnV0dG9uJyk7XG4gICAgICAgICAgICByZW1vdmVfYnRuLmF0dHIoJ2RhdGEtdGFyZ2V0JyxpZHgpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cbi8vfVxuLy99KTtcbn0iLCIvL2RlZmluZSgnX2Zvcm1zL192aWRlb3NGb3JtJywgWydleHBvcnRzJ10sIGZ1bmN0aW9uKF9fZXhwb3J0c19fXyl7XG4vLyAgIGNvbnNvbGUubG9nKF9fZXhwb3J0c19fXyk7XG4vLyAgICBfX2V4cG9ydHNfX18oKTtcbi8vfSk7XG4vL1xuLy9cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAkKCcjdGFncycpLnRhZ3NJbnB1dCh7XG4gICAgJ2hlaWdodCc6JzYwcHgnLFxuICAgICd3aWR0aCc6JzI4MHB4J1xuICB9KTtcblxuXG59KTtcbi8vIEBUT0RPIHdpbGwgY29uY2F0IGZpbGUgd2l0aCBndWxwIGluIHRoZSBmdXR1cmVcbi8vJC5nZXRTY3JpcHQoZG9tYWluLnNjcmlwdFBhdGgrXCJfZm9ybXMvX3ZpZGVvc0Zvcm0uanNcIiwgZnVuY3Rpb24oKXtcbi8vICAgIC8vcmVxdWlyZSgnLi9fZm9ybXMvX3ZpZGVvc0Zvcm0nKTtcbi8vfSk7XG5cbi8vcmVxdWlyZSBoYW5kbGViYXJzXG5cbi8vIEBUT0RPIGR1cCBpbiBndWxwXG5yZXF1aXJlKCcuLy4uL2xpYi9oZWxwZXJzL2hhbmRsZWJhcnMtaGVscGVycycpO1xuXG5yZXF1aXJlKCcuL19mb3Jtcy9fdmlkZW9zRm9ybS5qcycpLnZpZGVvSW5pdCgpO1xuXG4vL3JlcXVpcmUoJy4vdGVtcGxhdGVzL3F1aXp6ZXNGb3JtLmhhbmRsZWJhcnMnKTtcbi8vTXlBcHAgPSB3aW5kb3dbJ015QXBwJ10gfHx7fTtcbi8vTXlBcHAudGVtcGxhdGVzID0gd2luZG93WydNeUFwcCddLnRlbXBsYXRlcyB8fCB7fTtcblxuTXlBcHAgPSB3aW5kb3dbJ015QXBwJ10gfHx7fTtcbk15QXBwID0gcmVxdWlyZSgnLi9fZm9ybXMvX3F1aXp6ZXNGb3JtLmpzJyk7XG5cbmZ1bmN0aW9uIGZsYXNoKG1zZyl7XG5cbn1cblxuaWYoJCgnI2J1aWxkU2Nvcm0nKS5sZW5ndGgpe1xuICAgIHJlcXVpcmUoJy4vX2Zvcm1zL19zY3JvbUZvcm0uanMnKS5pbml0KCk7XG59XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgc2VsZj10aGlzLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3Npbmc7XG5cbmZ1bmN0aW9uIHByb2dyYW0xKGRlcHRoMCxkYXRhKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIG9wdGlvbnM7XG4gIGJ1ZmZlciArPSBcIlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJxdWl6LWdyb3VwXFxcIiBkYXRhLXRhcmdldD1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKGhlbHBlciA9IGhlbHBlcnMuc2V0SW5kZXggfHwgKGRlcHRoMCAmJiBkZXB0aDAuc2V0SW5kZXgpLG9wdGlvbnM9e2hhc2g6e30sZGF0YTpkYXRhfSxoZWxwZXIgPyBoZWxwZXIuY2FsbChkZXB0aDAsIChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCksIG9wdGlvbnMpIDogaGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCwgXCJzZXRJbmRleFwiLCAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpLCBvcHRpb25zKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiXFxcIj5cXG4gICAgICAgICAgPHVsIGNsYXNzPVxcXCJuYXYgbmF2LXBpbGxzIGdyb3VwLW5hdlxcXCIgaWQ9XFxcInF1aXp6ZXMtZ3JvdXBzLW5hdlxcXCI+XFxuICAgICAgICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC5xdWl6KSksc3RhY2sxID09IG51bGwgfHwgc3RhY2sxID09PSBmYWxzZSA/IHN0YWNrMSA6IHN0YWNrMS5xdWVzdGlvbnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoMiwgcHJvZ3JhbTIsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCIgcHVsbC1yaWdodFxcXCI+XFxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cXFwiYWRkXFxcIiBkYXRhLXRhcmdldD1cXFwiI3F1aXp6ZXMtZ3JvdXBzLW5hdlxcXCIgZGF0YS1hY3Rpb249XFxcImFkZFxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgZ3JvdXAtcGFuZS1hZGQtYnRuXFxcIj5BZGQgUXVlc3Rpb248L2J1dHRvbj5cXG4gICAgICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgPC91bD5cXG4gICAgICAgICAgXFxuICAgICAgICAgIFxcbiAgICAgICAgICBcXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWItY29udGVudCBncm91cC13cmFwcGVyXFxcIiBpZD1cXFwicXVpenplcy1ncm91cC0wXFxcIj5cXG4gICAgICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsICgoc3RhY2sxID0gKGRlcHRoMCAmJiBkZXB0aDAucXVpeikpLHN0YWNrMSA9PSBudWxsIHx8IHN0YWNrMSA9PT0gZmFsc2UgPyBzdGFjazEgOiBzdGFjazEucXVlc3Rpb25zKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtV2l0aERlcHRoKDUsIHByb2dyYW01LCBkYXRhLCBkZXB0aDApLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuXFxuICAgICAgPC9kaXY+XFxuXFxuICAgIDwvZGl2PlxcbiAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cbmZ1bmN0aW9uIHByb2dyYW0yKGRlcHRoMCxkYXRhLGRlcHRoMSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBvcHRpb25zO1xuICBidWZmZXIgKz0gXCJcXG4gICAgICAgICAgICAgICAgPGxpICBjbGFzcz1cXFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmlzQWN0aXZlKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDMsIHByb2dyYW0zLCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcXCIgaWQ9XFxcImdyb3VwLW5hdi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVxcXCJ0YWJcXFwiIGhyZWY9XFxcIiNncm91cC1wYW5lLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEub2luZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCItXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCIgdGl0bGU9XFxcIlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5xdWVzdGlvbikgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5xdWVzdGlvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKChoZWxwZXIgPSBoZWxwZXJzLnNldEluZGV4IHx8IChkZXB0aDAgJiYgZGVwdGgwLnNldEluZGV4KSxvcHRpb25zPXtoYXNoOnt9LGRhdGE6ZGF0YX0saGVscGVyID8gaGVscGVyLmNhbGwoZGVwdGgwLCAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpLCBvcHRpb25zKSA6IGhlbHBlck1pc3NpbmcuY2FsbChkZXB0aDAsIFwic2V0SW5kZXhcIiwgKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSwgb3B0aW9ucykpKVxuICAgICsgXCI8L2E+XFxuICAgICAgICAgICAgICAgIDwvbGk+XFxuICAgICAgICAgICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cbmZ1bmN0aW9uIHByb2dyYW0zKGRlcHRoMCxkYXRhKSB7XG4gIFxuICBcbiAgcmV0dXJuIFwiYWN0aXZlXCI7XG4gIH1cblxuZnVuY3Rpb24gcHJvZ3JhbTUoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYi1wYW5lIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICYmIGRlcHRoMC5pc0FjdGl2ZSksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgzLCBwcm9ncmFtMywgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCIgZ3JvdXAtcGFuZVxcXCIgaWQ9XFxcImdyb3VwLXBhbmUtXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5vaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcInRpdGxlXFxcIiBjbGFzcz1cXFwiY29sLXNtLTIgY29udHJvbC1sYWJlbFxcXCI+UXVlc3Rpb246PC9sYWJlbD5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tMSBjb2wtc20tb2Zmc2V0LTlcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS10YXJnZXQ9XFxcIiNncm91cC1wYW5lLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEub2luZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCItXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIlxcXCIgZGF0YS1hY3Rpb249XFxcInJlbW92ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiY2xvc2UgZ3JvdXAtcGFuZS1yZW1vdmUtYnRuXFxcIiB0aXRsZT1cXFwiIDFzdCB3b3VsZCBub3QgYmUgZGVsZXRlZCFcXFwiPsOXPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS0xMSBjb2wtc20tb2Zmc2V0LTFcXFwiPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiM1xcXCIgbmFtZT1cXFwicXVpenplc1tcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXVtxdWVzdGlvbl1cXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiRW50ZXIgdGhlIFF1ZXN0aW9uIHRpdGxlXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMucXVlc3Rpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAucXVlc3Rpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9ucy1ncm91cCBjb2wtc20tb2Zmc2V0LTFcXFwiIGlkPVxcXCJvcHRpb25zLWdyb3VwLXBhbmUtc3ViLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMSAmJiBkZXB0aDEub2luZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCItXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09IGZhbHNlID8gZGF0YSA6IGRhdGEuaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIi13cmFwcGVyXFxcIj5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmFuc3dlcnMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW1XaXRoRGVwdGgoNiwgcHJvZ3JhbTYsIGRhdGEsIGRlcHRoMCksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cCBjcnVkLW9wdGlvbi1jb250cm9sXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tMTAgY29sLXNtLW9mZnNldC0yXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRhcmdldD1cXFwiI2dyb3VwLXBhbmUtXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5vaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiLTBcXFwiICBkYXRhLWFjdGlvbj1cXFwiYWRkXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidG4gYnRuLWluZm8gcHVsbC1yaWdodCBncm91cC1wYW5lLXN1Yi1hZGQtYnRuXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZCBhbiBvcHRpb25cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcImNvcnJlY3RcXFwiIGNsYXNzPVxcXCJjb2wtc20tMyBjb250cm9sLWxhYmVsXFxcIj5Db3JyZWN0PC9sYWJlbD5cXG5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tOVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVxcXCIyXFxcIiBuYW1lPVxcXCJxdWl6emVzW1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJdW2NvcnJlY3RdXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIklmIENvcnJlY3QgOiBcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jb3JyZWN0KSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNvcnJlY3QpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGV4dGFyZWE+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcImluY29ycmVjdFxcXCIgY2xhc3M9XFxcImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcXFwiPkluY29ycmVjdDwvbGFiZWw+XFxuXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXNtLTlcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiMlxcXCIgbmFtZT1cXFwicXVpenplc1tcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXVtpbmNvcnJlY3RdXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIklmIGluY29ycmVjdCA6IFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmluY29ycmVjdCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbmNvcnJlY3QpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGV4dGFyZWE+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICBcIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuZnVuY3Rpb24gcHJvZ3JhbTYoZGVwdGgwLGRhdGEsZGVwdGgxKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwib3B0aW9uLWdyb3VwIGdyb3VwLXBhbmUtc3ViXFxcIiBpZD1cXFwiZ3JvdXAtcGFuZS1zdWItXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgxICYmIGRlcHRoMS5vaW5kZXgpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwib3B0aW9uXFxcIiBjbGFzcz1cXFwiY29sLXNtLTIgY29udHJvbC1sYWJlbFxcXCI+T3B0aW9uIDo8L2xhYmVsPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tOVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwicXVpenplc1tcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm9pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXVthbnN3ZXJzXVtcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXVtvcHRpb25dXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMub3B0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLm9wdGlvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIkVudGVyIG9wdGlvbiB0aXRsZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tMVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS10YXJnZXQ9XFxcIiNncm91cC1wYW5lLXN1Yi1cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm9pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiLVwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSBmYWxzZSA/IGRhdGEgOiBkYXRhLmluZGV4KSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtYWN0aW9uPVxcXCJyZW1vdmVcXFwiIGNsYXNzPVxcXCJjbG9zZSBncm91cC1wYW5lLXN1Yi1yZW1vdmUtYnRuXFxcIj7DlzwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXNtLTkgY29sLXNtLW9mZnNldC0yXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgbmFtZT1cXFwicXVpenplc1tcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkZXB0aDEgJiYgZGVwdGgxLm9pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXVthbnN3ZXJzXVtcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gZmFsc2UgPyBkYXRhIDogZGF0YS5pbmRleCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXVtjb3JyZWN0XVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiQ29ycmVjdCA/IFxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmNvcnJlY3QpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oNywgcHJvZ3JhbTcsIGRhdGEpLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiID5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcImNvcnJlY3RCb29sXFxcIiBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCI+Q29ycmVjdCA/PC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5mdW5jdGlvbiBwcm9ncmFtNyhkZXB0aDAsZGF0YSkge1xuICBcbiAgXG4gIHJldHVybiBcIiBjaGVja2VkIFwiO1xuICB9XG5cbiAgYnVmZmVyICs9IFwiPGRpdiBpZD1cXFwicXVpenplcy1ncm91cHNcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCIgYWxlcnQgYWxlcnQtaW5mb1xcXCIgaWQ9XFxcInF1aXpNc2dcXFwiIHN0eWxlPVxcXCJkaXNwbGF5Om5vbmU7XFxcIj5cXG4gICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWRpc21pc3M9XFxcImFsZXJ0XFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiPsOXPC9idXR0b24+XFxuICAgICAgICA8dWw+XFxuICAgICAgICAgICAgPGxpPlF1aXogQWRkZWQhPC9saT5cXG4gICAgICAgIDwvdWw+XFxuICAgIDwvZGl2PlxcbiAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC5mb3JtKSksc3RhY2sxID09IG51bGwgfHwgc3RhY2sxID09PSBmYWxzZSA/IHN0YWNrMSA6IHN0YWNrMS5xdWl6emVzKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDEsIHByb2dyYW0xLCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXAgY3J1ZC1xdWl6LWNvbnRyb2xcXFwiPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tMTBcXFwiPlxcbiAgICAgICAgPGhyLz5cXG5cXG4gICAgICAgIDxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9ICgoc3RhY2sxID0gKGRlcHRoMCAmJiBkZXB0aDAuZm9ybSkpLHN0YWNrMSA9PSBudWxsIHx8IHN0YWNrMSA9PT0gZmFsc2UgPyBzdGFjazEgOiBzdGFjazEuYWN0aW9uTmFtZSkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiPC9idXR0b24+XFxuICAgICAgICAmbmJzcDs8YSBocmVmPVxcXCIvYXJ0aWNsZXNcXFwiIHRpdGxlPVxcXCJjYW5jZWxcXFwiIGNsYXNzPVxcXCJidG5cXFwiPkNhbmNlbDwvYT5cXG5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH0pO1xuIixudWxsLCJcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignc2V0SW5kZXgnLCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgdGhpcy5vaW5kZXggPSB2YWx1ZTsgICAgIC8vIEBUT0RPIHNvbWUgdGltZSAuLi9pbmRleCBjYW4ndCB3b3JrP1xuICAgIHRoaXMuaGluZGV4ID0gTnVtYmVyKHZhbHVlICsgMSk7IC8vSSBuZWVkZWQgaHVtYW4gcmVhZGFibGUgaW5kZXgsIG5vdCB6ZXJvIGJhc2VkXG4gICAgcmV0dXJuIHRoaXMuaGluZGV4O1xufSk7XG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2xvb2t1cCcsIGZ1bmN0aW9uKG9iaiwgZmllbGQpe1xuICAgIHJldHVybiBvYmpbZmllbGRdO1xufSkiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
