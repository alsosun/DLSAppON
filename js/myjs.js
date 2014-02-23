
$(document).ready(function () {
    //global
    var org;
    var gr;
    var areasel;
    var str;
    emailchk()
    function emailchk() {

        if (localStorage.getItem('email') == null) {
            return false;
        };
        var current = localStorage.getItem('email')
        $("#email").val(current);
        $("#email1").val(current);
    };
    //news feed
    $("#news").on("pageshow", function () {
    $('#divRss').FeedEk({
        FeedUrl: 'http://dailyrubic.blogspot.com/feeds/posts/default',
        MaxCount: 5,
        ShowDesc: true,
        ShowPubDate: true,
        DescCharacterLimit: 100,
        TitleLinkTarget: '_blank'
      });
    });
    //news feed links to external browser
    $("#divRss").on("click", "a", function (e) {
        e.preventDefault();
        var targetURL = $(this).attr("href");
        window.open(targetURL, "_blank", "location=yes");
    });
    $(".extlk").on("click", function (e) {
        e.preventDefault();
        var targetURL = "http://www.digitallearnersolutions.com/cc/";
        window.open(targetURL, "_blank", "location=yes");
    });
    //submit user
    $("#login").submit(function (event) {
        
        event.preventDefault();
    });
    //guest sign in
    $("#guestBtn").on("click", function (event) {
        $.mobile.changePage("#home" , { transition: "slide"});
    });
    //rubric page
    //new rubric show
    $("#newrubriclink").on("click", function (event) {
        $("#newrubric").show();
        $("#editrubric").hide();
        $("#buildrubric").hide();
        $("#delrubric").hide();
        $("#start").hide();
        $("#rubric").hide();
        $("#grade_con").hide();
        $("#rubric").html("");
        $("#next").hide();
        $("#generic").hide();
        $("#exportcon").hide()
    });
    //edit rurbic show
    $("#editrubriclink").on("click", function (event) {
        $("#newrubric").hide();
        $("#editrubric").show();
        $("#buildrubric").show();
        $("#delrubric").show();
        $("#start").hide();
        $("#grade_con").hide();
        $("#rubric").html("");
        $("#next").hide();
        $("#rubriclabel").html("");
        $("#generic").hide();
        var startrubric = $("#rubric-select").find(":selected").text()
        $("#rubriclabel").html(startrubric);
        $("#exportcon").hide()
    });
    //del rubric show
    $("#delrubriclink").on("click", function (event) {
        $("#newrubric").hide();
        $("#editrubric").show();
        $("#buildrubric").show();
        $("#delrubric").show();
        $("#start").hide();
        $("#grade_con").hide();
        $("#rubric").html("");
        $("#next").hide();
        $("#rubriclabel").html("");
        $("#generic").hide();
        var startrubric = $("#rubric-select").find(":selected").text()
        $("#rubriclabel").html(startrubric);
        $("#exportcon").hide()
    });
    //load rubrics
    $("#rubrics").on("pageshow", function () { onSaskReady() });
    function onSaskReady() {        
        var rubricdd = $("#rubric-select");
        $("#rubric-select").find("option").remove().end();
        for (i = 1; i < 36; i++) {
            var rubricnm = window.localStorage.getItem("rubric" + i);
            //add names if none in storage
            if (window.localStorage.getItem("rubric" + i) !== null) {
                var o = new Option(i, i);
                $(o).html(rubricnm)
                rubricdd.append(o);
            };
        };//end for
        $("#rubric-select").selectmenu("refresh", true);
        //$("#rubric-select").val($("#rubric-select option:first").val());
        
    }
    //new rubric
    //limits length 
    $("#newrubricBtn").click(function () {
        var rubricnm = $("#new-rubric-name").val()
        var name_length = rubricnm.length;
        if (name_length < 1) {
            $("#popmessage").html("Please give your rubric a name.")
            $("#errorpop").popup("open");
            event.preventDefault();
            return false;
        };
        if (name_length > 15) {
            rubricnm = rubricnm.substring(0, 15);
        }
        //checks for name
        $("#rubric-select option").each(function (event) {
            if (rubricnm == $(this).text()) {
                $("#popmessage").html("You already have a rubric \n by that name. Try again.");
                $("#errorpop").popup("open");
                event.preventDefault();
                return false;
            };
        });
        //adds rubric name to first open spot
        $("#rubriclabel").html(rubricnm);
        for (i = 1; i < 36; i++) {
            if (window.localStorage.getItem("rubric" + i) === null) {
                window.localStorage.setItem("rubric" + i, rubricnm);
                localStorage.setItem("currentrubric", "rubric" + i);
                onSaskReady()
                $("#buildrubric").show();
                $("#editrubric").hide();
                $("#grade_con").show();
                $("#rubric").hide();
                $("#outtable").hide();
                $("#addout").hide();
                $("#next").hide();
                $("#popmessage").html("Rubric successfully created. \n Now add curriculum outcomes.");
                $("#errorpop").popup("open");
                $("#newrubric").hide();
                $("#generic").hide();
                $("#rubric-select").selectmenu("refresh", true);
                return;
            };
        };
        $("#popmessage").html("You already have 35 rubrics.  \n Delete a rubric if you need to add more.")
        $("#errorpop").popup("open");
    });
    //new rubric enter key
    $("#new-rubric-name").keydown(function(e) {
        if (e.keyCode == 13) {
            $("#newrubricBtn").click();
        }
    });
    
    //delete rubric
    $("#delrubricBtn").on("click", function () {
        var rubricnm = $("#rubric-select").find(":selected").text();
        $("#yesno").html("Are you sure you want to delete " + rubricnm + "?");
        $("#dialog").popup("open");
    });
    $("#dialogyes").on("click", function () {
        var rubricnm = "rubric" + $("#rubric-select").find(":selected").val();
        localStorage.removeItem(rubricnm);
        localStorage.removeItem(rubricnm + "bands");
        $("#rubric-select").find("option").remove().end();
        onSaskReady();
        $("#popmessage").html("Rubric successfully removed.");
        $("#errorpop").popup("open");
    });

    //populate strand
    $("#areasel").change(function () {
        
        areasel = $("#areasel option:selected").text();
        if ($(this).val() == "select subject") {         
            $("#strand").hide();
            return;
        }
        $("#subdd").find("option").remove().end();
        var dropdown = document.getElementById("subdd");

        dropdown[dropdown.length] = new Option("select subject", "select strand");
        xml = loadXMLDoc("resources/ont/grade_" + gr + "_" + areasel + ".xml");

        path = "//strand_text"

        // code for IE
        if (window.ActiveXObject) {
            var nodes = xml.selectNodes(path);

            for (i = 0; i < nodes.length; i++) {
                ddlist[0] = nodes[i].childNodes[0].nodeValue;
                dropdown[dropdown.length] = new Option(ddlist[i], ddlist[i]);

            }
        }
            // code for Mozilla, Firefox, Opera, etc.
        else if (document.implementation && document.implementation.createDocument) {
            var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
            var result = nodes.iterateNext();

            while (result) {

                var sub = result.childNodes[0].nodeValue
                dropdown[dropdown.length] = new Option(sub, sub);
                result = nodes.iterateNext();
            }
        }
        $("#strand").show()
    });
    //populate subjects
    $("#gradedd").change(function () {
        $("#strand").hide();
        gr = $(this).val()
        popsub();
        $("#subjects").show();
        $("#subdd").val("select subject").attr("selected", true);
        $("#subdd").selectmenu("refresh", true);
        
        

    });
    //populate subjects
    function popsub() {
        
        $("#areasel").find("option").remove().end();
        var dropdown = document.getElementById("areasel");
        
        //dropdown.innerHTML = "";
        dropdown[dropdown.length] = new Option("select subject", "select subject");
        xml = loadXMLDoc("resources/ont/oncur.xml");
        
        path = "/curriculum/grade/subjects[@id='" + gr + "']"
        
        // code for IE
        if (window.ActiveXObject) {
            var nodes = xml.selectNodes(path);

            for (i = 0; i < nodes.length; i++) {
                ddlist[0] = nodes[i].childNodes[0].nodeValue;
                dropdown[dropdown.length] = new Option(ddlist[i], ddlist[i]);

            }
        }
            // code for Mozilla, Firefox, Opera, etc.
        else if (document.implementation && document.implementation.createDocument) {
            var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
            var result = nodes.iterateNext();

            while (result) {

                var sub = result.childNodes[0].nodeValue
                dropdown[dropdown.length] = new Option(sub, sub);
                result = nodes.iterateNext();
            }
        }
        
    }
    function loadXMLDoc(dname) {
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        }
        else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET", dname, false);
        xhttp.send("");
        return xhttp.responseXML;
    }
    //strand selection
    $("#subdd").change(function () {
        try {
            str = $("#subdd option:selected").text();
            xml = loadXMLDoc("resources/ont/grade_" + gr + "_" + areasel + ".xml");
            path = "/curriculum/strand[@id='" + str + "']/overalls/overall/overall_text"
          
            var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);          
            var result = nodes.iterateNext();
            var txt = txt = "<table class='rubrictable'><tr><th>add to rubric</th><th>Code</th><th>Grade " + gr + " " + str + " Overalls</th></tr>";

            while (result) {
                ind = result.parentNode.getAttribute("id")
                var over = result.childNodes[0].nodeValue
                txt = txt + "<tr><td><form><input type='checkbox'></input></td><td>" + ind + "</td><td>" + over + "</td></tr>"
                result = nodes.iterateNext();
                
            }
            txt = txt + "<tr><td>citation</td><td>Adapted from:</td><td>Ontario Ministry of Education @ www.edu.gov.on.ca/eng/teachers/curriculum.html</td></tr></table></table>"
            document.getElementById('outtable').innerHTML = txt;
            $("#outtable").show();
            $("#addout").show();
            $("#generic").hide();
        }
        catch (err) {
           alert(err.message)
        }
    });
    //popout
    function popout() {    
        
        xml = loadXMLDoc("resources/ont/grade_" + gr + "_" + areasel + ".xml");
        path = "/LearningStandards/LearningStandardItem/StatementCodes/StatementCode"
        pathout = "/LearningStandards/LearningStandardItem/Statements/Statement"
        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        var nodesout = xml.evaluate(pathout, xml, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();
        var resultout = nodesout.iterateNext();
        var txt = txt = "<table class='rubrictable'><tr><th>add to rubric</th><th>Code</th><th>Grade " + gr + " " + str + " Standards</th></tr>";

        while (result) {
            
            if (result.childNodes.length > 0) {
                var ind = result.childNodes[0].nodeValue;
                var newind = ind.replace(/\./g, ' ')
            } else {
                var newind = "n/a"
            }
            if (resultout.childNodes.length > 0) {
                var over = resultout.childNodes[0].nodeValue;
                
            } else {
                var over = "n/a"
            }         
            txt = txt + "<tr><td><form><input type='checkbox'></input></td><td>" + newind + "</td><td>" + over + "</td></tr>"
            result = nodes.iterateNext();
            resultout = nodesout.iterateNext();         
        }

        txt = txt + "<tr><td></td><td>Adapted from:</td><td>Common Core State Standards XML files @ www.corestandards.org</td></tr></table></table>"
        document.getElementById('outtable').innerHTML = txt;
        $("#outtable").show();
        $("#addout").show();
        $("#generic").hide();
    }
    //populate outcomes
   
 // creates rubric
    $('#addoutBtn').on('click', function () {
        if ($('input:checked').length < 1) {
            $("#popmessage").html("Select at least one outcome.");
            $("#errorpop").popup("open");
            return;
        }
        var txt = "";
        $('input:checked').each(function (i) {
            i++;
            $this = $(this).closest("tr");
            var code = $this.find('td').eq(1).text();
            var out = $this.find('td').eq(2).text();
            txt = txt + "<table id='band" + i + "' class='rubrictable' border='1' style='width:100%' ><tr><th style='width:5%'>ID</th><th style='width:45%'>Outcome</th>\
                        <th style='width:10%'>Level 1</th><th style='width:10%'>Level 2</th><th style='width:20%'>Level 3</th>\
                        <th style='width:10%'>Level 4</th></tr><tr><td>" + code + "</td><td>" + out + "</td><td>Beginning</td>\
                        <td>Progressing</td><td>Meeting</td><td>Established</td></tr></table>";
            //<form><input type='range' name='"+ code + "' id='" + code + "' data-highlight='true' min='0' max='100' value='50' /></form>";
        });
        var rubric = txt;
        $("#rubric").append(txt).trigger("create");
        rubricautosave();
        $("#rubric").show();           
        $("#outtable").hide();
        $("#addout").hide();
        $("#grade_con").hide();
        $("#next").show();
        $("#generic").hide();
    });
    //adds custom outcome
    $("#addcustoutBtn").on("click", function () {
        var i = $("#rubric table").size() + 1;
        var code = "custom " + i
        var out = $("#outcome").val();
        var txt = "<table id='band" + i + "' class='rubrictable' border='1' style='width:100%'><tr><th style='width:5%'>ID</th><th style='width:45%'>Outcome</th>\
                        <th style='width:10%'>Level 1</th><th style='width:10%'>Level 2</th><th style='width:20%'>Level 3</th>\
                        <th style='width:10%'>Level 4</th></tr><tr><td>" + code + "</td><td>" + out + "</td><td>Beginning</td>\
                        <td>Progressing</td><td>Meeting</td><td>Established</td></tr></table>";

        $("#rubric").append(txt).trigger("create");
        rubricautosave();
        $("#rubric").show();
        $("#outtable").hide();
        $("#addout").hide();
        $("#grade_con").hide();
        $("#next").show();
        $("#generic").hide();
        
    });
    //clear rubric
    $("#clearBtn").on("click", function () {
        $("#rubric").html(" ").trigger("create");
        $("#rubric").hide();
        $("#grade_con").show();
        $("#next").hide();
        $("#generic").hide();
        $("#grades").hide();
        $("#subjects").hide();
        $("#strand").hide();
        $("#exportcon").hide()
    });
    //add more to rubric
    $("#addmoreBtn").on("click", function () {
        //$("#rubric").hide();
        $("#grade_con").show();
        $("#next").hide();
        $("#generic").hide();
        $("#grades").show();
        $("#subjects").hide();
        $("#strand").hide();
        $("#exportcon").hide()
    });
    //save rubric
    $("#saveBtn").on("click", function () {
        var currentrubric = localStorage.getItem("currentrubric");
        var rubrictbl = $("#rubric").html();
        localStorage.setItem(currentrubric + "bands", rubrictbl);
        $("#popmessage").html("Saved! To use this rubric, select \n 'Assessment' in the main menu.");
        $("#errorpop").popup("open");
        //$("#rubric").hide();
        //$("#grade_con").show();
        $("#next").hide();
        $("#exportcon").hide()
    });
    //auto save rubric
    function rubricautosave() {
        var currentrubric = localStorage.getItem("currentrubric");
        var rubrictbl = $("#rubric").html();
        localStorage.setItem(currentrubric + "bands", rubrictbl);
    };
    //edit rubric
    $("#editrubricBtn").on("click", function () {
        var rubricnm = "rubric" + $("#rubric-select").find(":selected").val();
        var bands = localStorage.getItem(rubricnm + "bands");
        $("#rubric").html("");
        $("#rubric").html(bands);
        $("#rubric").show();
        $("#next").show();
        $("#editrubric").hide();
        $("#delrubric").hide();
        $("#generic").hide();
        $("#exportcon").hide()
    });
    $("#rubric-select").change(function () {
        var rubricnm = "rubric" + $("#rubric-select").find(":selected").val();
        var rubricnmtxt = $("#rubric-select").find(":selected").text();
        localStorage.setItem("currentrubric", rubricnm);
        $("#rubriclabel").html(rubricnmtxt);
        $("#next").hide();
        $("#exportcon").hide()
    });
    //edit cells
    $("#rubric").on('click', 'td', function () {
        //if ($("#outtable").is(":visible")) {
        //    return
        //};
        $("#editpop").popup("open");
        var cell = $(this).text();
        org = $(this);
        $("#edittxt").val(cell)
    });

    $("#editcloseBtn").on('click', function (event) {
        var newTXT = $('#edittxt').val()       
        $(org).html(newTXT)
        rubricautosave();
    });
    $("#genericBtn").on("click", function () {
        $("#generic").show();
        $("#grade_con").hide();
    });
    $("#icans").on('click', 'a', function () {
        var ican = $(this).text();
        $("#outcome").val(ican);
        $("#icancon").collapsible("collapse");
        
    });
    $("#openexport").on('click', function () {
        $("#exportcon").show()
        $("#next").hide()
    });
    $("#exportBtn").on('click', function (e) {
        if ($("#email").val == "") {
            $("#popmessage").html("need to enter an email address");
            $("#errorpop").popup("open");
            return false;
        };
        e.preventDefault();
        var exrubric = $('#rubric').html();
        var exrubricname = $('#rubriclabel').html();
        var currentemail = $("#email").val()
        localStorage.setItem('email', currentemail)

        $('#rubricname').val(exrubricname);
        $('#hiddenrubric').val(exrubric);
        $('#loader').show();
        $("#rubricform").submit();
        
        return true;
    });
    //end of rubrics
    //classes page
    // popup menu
    //addclasses show
    $("#addclasslink").on("click", function (event) {
        $("#addclass").show();
        $("#delclass").hide();
        $("#addst").hide();
        $("#delst").hide();
    });
    //delclasses show
    $("#delclasslink").on("click", function (event) {
        $("#addclass").hide();
        $("#delclass").show();
        $("#addst").hide();
        $("#delst").hide();
    });
    //addst show
    $("#addstlink").on("click", function (event) {
        $("#addclass").hide();
        $("#delclass").hide();
        $("#addst").show();
        $("#delst").hide();
    });
    //delst show
    $("#delstlink").on("click", function (event) {
        $("#addclass").hide();
        $("#delclass").hide();
        $("#addst").hide();
        $("#delst").show();
    });
    //load classes
    function onClassesReady() {
        var classdd = $("#classes-select");
        $("#classes-select").find("option").remove().end();
        for (i = 1; i < 9; i++) {
            var classnm = window.localStorage.getItem("class" + i);
            //add names if in storage
            if (window.localStorage.getItem("class" + i) !== null) {
                var o = new Option(i, i);
                $(o).html(classnm)
                classdd.append(o);
                
            };
        };//end for
        $("#classes-select").selectmenu("refresh", true);
        onClassSelect();
    }
    //load classes on page show
    $("#classes").on("pageshow", function () { onClassesReady() });
    //add class
    //new new enter key
    $("#new-class-name").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#addclassBtn").click();
        }
    });
    //limits length 
    $("#addclassBtn").click(function () {
        var classnm = $("#new-class-name").val()
        var name_length = classnm.length;
        if (name_length < 1) {
            $("#popmessagecl").html("Please give your class a name.")
            $("#errorpopcl").popup("open");
            event.preventDefault();
            return false;
        };
        if (name_length > 15) {
            classnm = classnm.substring(0, 15);
        }
        //checks for name
        $("#classes-select option").each(function (event) {
            if (classnm == $(this).text()) {
                $("#popmessagecl").html("You already have a class \n by that name. Try again.")
                $("#errorpopcl").popup("open");
                event.preventDefault();
                return false;
            };
        });
        //adds name to first open spot
        for (i = 1; i < 9; i++) {
            if (window.localStorage.getItem("class" + i) === null) {
                window.localStorage.setItem("class" + i, classnm);
                onClassesReady();                
                $("#popmessagecl").html("Class successfully added. \n Now add students to it.");
                $("#errorpopcl").popup("open");
                $("#addst").show();
                $("#addclass").hide();
                $("#classes-select option:contains("+classnm+")").prop('selected', true)
                $("#classes-select").selectmenu("refresh", true);
                onClassSelect();
                return;
            };
        };
        $("#popmessagecl").html("You already have 8 classes.  \n Delete a class if you need to add more.")
        $("#errorpopcl").popup("open");
    });
    //del class
    $("#delclassBtn").on("click", function (event) {
        var selclass = $("#classes-select").find(":selected").text();
        $("#yesnocl").html("Are you sure you want to delete " + selclass + "?");
        $("#dialogcl").popup("open");
    });
    $("#dialogyescl").on("click", function () {
        var selclass = "class" + $("#classes-select").find(":selected").val();
        localStorage.removeItem(selclass);
        $("#classes-select").find("option").remove().end();
        delAllStudents(selclass);
        onClassesReady();
        onClassSelect();
        $("#students-select").selectmenu("refresh", true);
    });
    $("#dialognocl").on("click", function () {
        return;
    });
    //del all student in a class
    function delAllStudents(classsel) {
        for (i = 1; i < 36; i++) {
            var stnm = localStorage.getItem(classsel + "st" + i);

            localStorage.removeItem(classsel + "st" + i);
        };
    };
    //change of class
    function onClassSelect() {
        $("#students-select").find("option").remove().end();
        var classsel = "class" + $("#classes-select").find(":selected").val();
        var stdd = $("#students-select");
        for (i = 1; i < 36; i++) {
            var stnm = localStorage.getItem(classsel + "st" + i);
            if (localStorage.getItem(classsel + "st" + i) === null) {
                continue;
            };
            var o = new Option(i, i);
            $(o).html(stnm);
            stdd.append(o);
        }
        $('#students-select option').sort(NASort).appendTo('#students-select');
        $("#students-select").selectmenu("refresh", true);
        return false;
    }
    //alpha sorter
    function NASort(a, b) {
        if (a.innerHTML == 'NA') {
            return 1;
        }
        else if (b.innerHTML == 'NA') {
            return -1;
        }
        return (a.innerHTML > b.innerHTML) ? 1 : -1;
    };
    //on class slection get students
    $("#classes-select").change(function () {
        if ($("#classes-select").find(":selected").text() === "Class") {
            event.preventDefault();
            return false;
        };
        onClassSelect();
    });
    //new student enter key
    $("#new-st-name").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#addstBtn").click();
        }
    });
    //add student
    $("#addstBtn").on("click", function (event) {
        if ($("#classes-select").find(":selected").text() == "Class") {
            event.preventDefault();
            $("#popmessagecl").html("Please select a class first.");
            $("#errorpopcl").popup("open");
            return false;
        };
        var stnm = $("#new-st-name").val();
        var name_length = stnm.length;
        if (name_length < 1) {
            $("#popmessagecl").html("Please enter a student name.")
            $("#errorpopcl").popup("open");
            event.preventDefault();
            return false;
        };
        var classsel = "class" + $("#classes-select").val() + "st";
        
        for (i = 1; i < 36; i++) {
            if (localStorage.getItem(classsel + i) === null) {
                localStorage.setItem(classsel + i, stnm);
                onClassSelect();
                $("#popmessagecl").html(stnm + " successfully added.");
                $("#errorpopcl").popup("open");
                return false;
            };
        };
    });
    //del student
    $("#delstBtn").on("click", function (event) {
        var selst = $("#students-select").find(":selected").text();
        $("#yesno1").html("Are you sure you want to delete " + selst + "?");
        $("#dialog1").popup("open");
    });
    $("#dialogyes1").on("click", function () {
        var selst = "st" + $("#students-select").find(":selected").val();
        var selclass = "class" + $("#classes-select").find(":selected").val();
        localStorage.removeItem(selclass + selst);
        onClassSelect();
    });
    $("#dialogno1").on("click", function () { });
    //end of classes
    //Assessment page
    //menu
    $("#newassesslink").on("click", function (event) {
        $("#reportstart").hide();
        $("#newassess").show();
        $("#loadassess").hide();
        $("#assessmentinput").hide();
        $("#report-con").hide();
        $("#reportlabel").html("")
        $("#assessmentinput").hide();
        $("#report-con").hide();
        $("#reportexcon").hide();
    });
    //loadclasses show
    $("#loadassesslink").on("click", function (event) {
        $("#reportstart").hide();
        $("#newassess").hide();
        $("#loadassess").show();
        $("#assessmentinput").hide();
        $("#report-con").hide();
        $("#reportlabel").html("")
        $("#assessmentinput").hide();
        $("#report-con").hide();
        $("#reportexcon").hide()
    });
    //del assessment
    $("#delassesslink").on("click", function (event) {
        $("#reportstart").hide();
        $("#newassess").hide();
        $("#loadassess").show();
        $("#assessmentinput").hide();
        $("#report-con").hide();
        $("#reportlabel").html("")
        $("#assessmentinput").hide();
        $("#report-con").hide();
        $("#reportexcon").hide()
    });
    //load rubrics, classes
    $("#assess").on("pageshow", function () {
        onRubReady();
        onClassReady();
        onReportSelect();
    });
    function onRubReady() {
        var rubricdd = $("#assess-rub-select");
        $("#assess-rub-select").find("option").remove().end();
        for (i = 1; i < 36; i++) {
            var rubricnm = window.localStorage.getItem("rubric" + i);
            //add names if none in storage
            if (window.localStorage.getItem("rubric" + i) !== null) {
                var o = new Option(i, i);
                $(o).html(rubricnm)
                rubricdd.append(o);
            };
        };//end for
        $("#assess-rub-select").selectmenu("refresh", true);
    }
    //load classes
    function onClassReady() {
        var classdd = $("#assess-cl-select");
        $("#assess-cl-select").find("option").remove().end();
        for (i = 1; i < 9; i++) {
            var classnm = window.localStorage.getItem("class" + i);
            //add names if in storage
            if (window.localStorage.getItem("class" + i) !== null) {
                var o = new Option(i, i);
                $(o).html(classnm)
                classdd.append(o);
            };
        };//end for
        $("#assess-cl-select").selectmenu("refresh", true);
    }
    //load students
    $("#assess-cl-select").change(function () {
        if ($("#assess-cl-select").find(":selected").text() === "Class") {
            event.preventDefault();
            return false;
        };
        //onClassAssSelect();
    });
    function onClassAssSelect() {
        $("#assess-st-select").find("option").remove().end();
        var classsel = "class" + $("#assess-cl-select").find(":selected").val();
        var stdd = $("#assess-st-select");
        for (i = 1; i < 36; i++) {
            var stnm = localStorage.getItem(classsel + "st" + i);
            if (localStorage.getItem(classsel + "st" + i) === null) {
                continue;
            };
            var o = new Option(i, i);
            $(o).html(stnm);
            stdd.append(o);
        }
        $('#assess-st-select option').sort(NASort).appendTo('#assess-st-select');
        $("#assess-st-select").selectmenu("refresh", true);
        return false;
    }
    //refresh reports

    function onReportSelect() {
        $("#assess-report-select").find("option").remove().end();   
        var repdd = $("#assess-report-select");
        for (i = 1; i < 36; i++) {
            var repnm = localStorage.getItem("reportnm" + i);
            if (localStorage.getItem("reportnm" + i) === null) {               
                continue;
            };
            var o = new Option(i, i);
            $(o).html(repnm);
            repdd.append(o);         
        };
        $("#assess-report-select").selectmenu("refresh", true);
    };
    //new report

    $("#newassessBtn").on("click", function () {      
        var classsel = $("#assess-cl-select").find(":selected").text();
        var classselval = $("#assess-cl-select").find(":selected").val();
        var rubsel = $("#assess-rub-select").find(":selected").text();
        var rubselval = "rubric" + $("#assess-rub-select").find(":selected").val() + "bands";
        var rubricbands = localStorage.getItem(rubselval);
        for (i = 1; i < 36; i++) {
            if (localStorage.getItem("reportnm" + i) === null) {
                localStorage.setItem("reportnm" + i, classsel + " " + rubsel);
                localStorage.setItem("reportnm" + i + "class", classselval);
                localStorage.setItem("reportnm" + i + "report", "");
                localStorage.setItem("reportnm" + i + "rubric", rubricbands);
                localStorage.setItem("currentassess", "reportnm" + i);
                $("#reportlabel").html(classsel + " " + rubsel);
                $("#temp").html(rubricbands);
                $("#report").html("");
                onReportSelect();
                onClassAssSelect();
                loadAssess();
                onRubric();
                $("#newassess").hide();
                $("#assessmentinput").show();
                $("#report-con").show();
                return false;
            };
        };
    });
    //del report

    $("#delassessBtn").on("click", function () {    
            var selrep = $("#assess-report-select").find(":selected").text();
            $("#yesnoas").html("Are you sure you want to delete " + selrep + "? \n Note: this will also delete student reports that have not been exported.");
            $("#dialogas").popup("open");
        });
    $("#dialogyesas").on("click", function () {
            var selrep = "reportnm" + $("#assess-report-select").find(":selected").val();
            localStorage.removeItem(selrep);
            localStorage.removeItem(selrep + "report");
            localStorage.removeItem(selrep + "rubric");
            localStorage.removeItem(selrep + "class");
            for (i = 1; i < 36; i++) {
                localStorage.removeItem(selrep + "note" + i)
                localStorage.removeItem(selrep + "piclink" + i)
            };
            onReportSelect();
        });
    $("#dialognoas").on("click", function () {
            return;
        });
    function loadAssess() {
        var txt = ""
        $("#temp table").each(function (i) {
            i++;
            var band = $(this).html();
            var code = $(this).find('td').eq(0).text();
            var slide = "<form><input type='range' name='" + code + "' id='" + code + "' data-highlight='true' min='0' max='100' value='50' /></form>"         
            txt = txt + "<table class='rubrictable' style='width:100%'>" + band + "</table><table class='rubrictable' style='width:100%'>" + slide + "</table>"
        });
        $("#sliders").html(txt).trigger("create");
    };
    
    function onRubric() {
        var rep = "<table id='rubtbl' class='rubrictable' border='1' style='width:100%'><thead><tr><th>Student</th>";
        //reads slider #
        var i = 1
        $.mobile.activePage.find('[type=number]')
            .each(function () {
                var self = this;
                var code = $(self).attr("name");
                rep = rep + "<th>" + code + "</th>";
                i++;
            });

        rep = rep + "</tr></thead><tbody></tbody></table>"
        var lable = $("#reportlabel").html()
        $("#reporttop").html(lable);
        $("#report").append(rep).trigger("create")
    }
    //add student data
    $("#adddataBtn").click(function () {
        slide();
    });
    function slide() {
        var count = 0;
        var sdnt = $("#assess-st-select option:selected").text();
        var rep = "<tr><td>" + sdnt + "</td>"
        $.mobile.activePage.find('[type=number]')
            .each(function () {
                var self = this;
                var code = $(self).attr("name");
                var score = $(self).val();
                rep = rep + "<td>" + score + "</td>"
            });
        rep = rep + "</tr>"
        $("#report tbody:last").append(rep)
        saveprogress()
    }
    //save progress btn
    $("#donedataBtn").click(function () {
        var currentassessment = localStorage.getItem("currentassess")
        var currentreport = $("#report").html();
        localStorage.setItem(currentassessment + "report", currentreport);
        $("#assesspopmessage").html("Assessment progress is saved. To continue at a later time, select 'Load Saved Assessment' from the menu above");
        $("#assesspopup").popup("open");
    });
    //save progress auto
    function saveprogress() {
        var currentassessment = localStorage.getItem("currentassess")
        var currentreport = $("#report").html();
        localStorage.setItem(currentassessment + "report", currentreport);
    };
    //load assessment
    $("#loadassessBtn").on("click", function () {
        var assesslabel = $("#assess-report-select").find(":selected").text();
        var assesssel = "reportnm" + $("#assess-report-select").find(":selected").val();
        localStorage.setItem("currentassess", assesssel);
        var rubric = localStorage.getItem(assesssel + "rubric");
        var report = localStorage.getItem(assesssel + "report");
        var classnm = localStorage.getItem(assesssel + "class");
        $("#reportlabel").html(assesslabel);
        $("#temp").html(rubric);
        //$("#reporttry").html(report);
        $("#report").html("");
        $("#report").html(report);
        onClassAssLoad(classnm);       
        loadAssess();      
        $("#newassess").hide();
        $("#loadassess").hide();
        $("#assessmentinput").show();
        $("#report-con").show();
        //dataTablecall()
        return false;                  
    });
    //set class when prior assessment is loaded
    function onClassAssLoad(classnm) {
        $("#assess-st-select").find("option").remove().end();
        var classsel = "class" + classnm;
        var stdd = $("#assess-st-select");
        for (i = 1; i < 36; i++) {
            var stnm = localStorage.getItem(classsel + "st" + i);
            if (localStorage.getItem(classsel + "st" + i) === null) {
                continue;
            };
            var o = new Option(i, i);
            $(o).html(stnm);
            stdd.append(o);
        }
        $('#assess-st-select option').sort(NASort).appendTo('#assess-st-select');
        $("#assess-st-select").selectmenu("refresh", true);
        return false;
    }
    $("#exportdataBtn").on("click", function () {
        //var body = $('#report').table2CSV({ delivery: 'value' });
        //body = encodeURIComponent(body)
        //var subject = "Daily Rubric Report: " + $("#reportlabel").html();        
        //window.location = "mailto:?subject=" + subject + "&body=" + body;
        $("#reportexcon").show()
    });
    //export assessment table
    $("#exportreportBtn").on('click', function (e) {
        if ($("#email1").val == "") {
            $("#assessmessage").html("need to enter an email address");
            $("#assesspop").popup("open");
            return false;
        };
        e.preventDefault();
        var exreport = $('#report').html();
        var exreportname = $('#reportlabel').html();
        var currentemail = $("#email1").val()
        localStorage.setItem('email', currentemail)
        var notes = exportNotes()
        $('#hiddennotes').val(notes);
        $('#reportname').val(exreportname);
        $('#reporttable').val(exreport);
        $('#loader2').show()
        $("#reportform").submit();
        
    });
    function exportNotes() {
        //loop through stds and get notes to a <p></p>
        var currentassessment = localStorage.getItem("currentassess")
        var txt = "<h2>Assessment Notes</h2>"
        for (i = 1; i < 36; i++) {
            var note = localStorage.getItem(currentassessment + "note" + i)
            if (localStorage.getItem(currentassessment + "note" + i) !== null) {

                note = localStorage.getItem(currentassessment + "note" + i)
                var stname = $("#assess-st-select option[value='" + i + "']").text();
                txt = txt + "<h3>" + stname + "</h3><p>" + note + "</p>"

            };

        }

        return txt;
    };
    //tabletools for web version
    //function dataTablecall() {
    //    $('#reporttry table').dataTable({
    //        "bPaginate": false,
    //        "sDom": 'T<"clear">lfrtip',
    //        "oTableTools": {
    //            "sSwfPath": "mobile/media/swf/copy_csv_xls_pdf.swf"
    //        }
           
    //    });
        
    //};
   

    //end of assess
    //planner
    //scale videos
    function scale(width, height, padding, border) {
        
        var scrWidth = $(window).width() - 30,
            scrHeight = $(window).height() - 30,
            ifrPadding = 2 * padding,
            ifrBorder = 2 * border,
            ifrWidth = width + ifrPadding + ifrBorder,
            ifrHeight = height + ifrPadding + ifrBorder,
            h, w;

        if (ifrWidth < scrWidth && ifrHeight < scrHeight) {
            w = ifrWidth;
            h = ifrHeight;
        } else if ((ifrWidth / scrWidth) > (ifrHeight / scrHeight)) {
            w = scrWidth;
            h = (scrWidth / ifrWidth) * ifrHeight;
        } else {
            h = scrHeight;
            w = (scrHeight / ifrHeight) * ifrWidth;
        }

        return {
            'width': w - (ifrPadding + ifrBorder),
            'height': h - (ifrPadding + ifrBorder)
        };
    };
    $("#popupVideo-1 iframe")
        .attr("width", 0)
        .attr("height", 0);

    $("#popupVideo-1").on({
        popupbeforeposition: function () {

            var size = scale(497, 298, 15, 1),
                w = size.width,
                h = size.height,
                markup = " <iframe src='http://www.youtube.com/embed/IUtff1owJZA' width='" + w + "' height='" + h + "'  seamless></iframe>";

            $("#popupVideo-1").html(markup);
            //$("#popupVideo-1 iframe")
            //    .attr("width", w)
            //    .attr("height", h);
        },
        popupafterclose: function () {
            $("#popupVideo-1").html("<span></span>");
            //$("#popupVideo iframe")
            //    .attr("width", 0)
            //    .attr("height", 0);
        }
    });
    ////vid 2
    $("#popupVideo-2 iframe")
    .attr("width", 0)
    .attr("height", 0);

    $("#popupVideo-2").on({
        popupbeforeposition: function () {
            var size = scale(497, 298, 15, 1),
                w = size.width,
                h = size.height,
                markup = " <iframe src='http://www.youtube.com/embed/1cp2YgrU3ws?rel=0' width='" + w + "' height='" + h + "'  seamless></iframe>";

            $("#popupVideo-2").html(markup);

        },
        popupafterclose: function () {
            $("#popupVideo-2").html("<span></span>");
        }
    });
    //camera and notes
    function getImage() {
        var stname = $("#assess-st-select option:selected").text();
        var stvalue = $("#assess-st-select option:selected").val();
        var currentassessment = localStorage.getItem("currentassess")
        //check if link to image exists and set up popup
        var note = localStorage.getItem(currentassessment + "note" + stvalue)
        //var piclink = localStorage.getItem(currentassessment + "piclink" + stvalue)
        $("#anecdote").val(note)
        $("#stdimagename").html(stname)
        //var imageURI
        //if (piclink == null) {
        //    imageURI = "assests/images/noimage.png"
        //} else {
        //    imageURI = piclink
        //}
        
        //var size = scale(497, 298, 15, 1),
        //    w = size.width,
        //     h = size.height,
        //    markup = "<img src='" + imageURI + "' width='" + w + "' height='" + h + "' />";

        //$("#pic").html(markup)
           
    };
    $("#picpopdone").on("click", function () {
        var stvalue = $("#assess-st-select option:selected").val();
        //check if link to image exists and set up popup
        var note = $("#anecdote").val()
        var currentassessment = localStorage.getItem("currentassess")
        localStorage.setItem(currentassessment + "note" + stvalue, note)
    })
    $("#openpicpop").on("click", function () { openPicNote() })
    $("#opennotepop").on("click", function () { openPicNote() })

    function openPicNote() {
        getImage()
        $(':mobile-pagecontainer').pagecontainer('change', '#picpop', {
            transition: 'flip',
            //changeHash: true,
            //reverse: true,
            //role: "dialog",
            showLoadMsg: true
        });
    };
    $("#picpop").keydown(function (e) {
        if (e.keyCode == 13) {
            $("##picpopdone").click();
        }
    });
});