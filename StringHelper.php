<?php
class StringHelper{
    const TRUE_FUNCTION = 'true()';
    const SQL_SELECT_STRING = '##SQL-SELECT-STRING##';
    const REGEX_MATCH_ALL = '(.*?)\ /'
    private static function replaceFunction($string, $functionName, $placeholder) {
        preg_match_all("/{$functionName}\( (.*?)\ \)/", $string, $matches);
        for($i = 0; $i < sizeof($matches[0]); $i++) {
            $string = preg_replace("/{$functionName}\( (.*?)\ \)/", $placeholder, $string);
        }
        return [$string, $matches];
    }
    private static function commonStringReplacements($string) {
        $replacements = [
            'format-date-time' => 'formatDateTime',
            'format-date' => 'formatDate',
            'decimal-date-time' => 'decimalDateTime',
            'selected-at' => 'selectedAt',
            'choice-name' => 'choiceName',
            'count-selected' => 'countSelected',
            'string-length' => 'stringLength',
            'substr-jsonpath' => 'substrJsonpath',
            'int(' => 'rtParseInt(',
            ' and ' => '&&',
            ' or ' => '||',
            ' div ' => ' / ',
            ' mod ' => '%',
            ' = ' => '===',
            ' !== ' => ' != ',
            '>==' => '>=',
            '<==' => '<=',
            self::TRUE_FUNCTION => 'true'
        ];
        foreach ($replacements as $search => $replace) {
            $string = str_replace($search, $replace, $string);
        }
        $string = preg_replace('/if\(|if \(/', 'rtIf(', $string);
        return $string;
    }
    public static function startsWith($haystack, $needle)
    {
        $length = strlen($needle);
        return (substr($haystack, 0, $length) === $needle);
    }
    public static function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }
        return (substr($haystack, -$length) === $needle);
    }
    public static function splitAppearance($appearance){
        $appearances = [];
        $br = 0;
        $t = '';
        for($i=0;$i<strlen($appearance);$i++){
            $char =  $appearance[$i];
            $t = $t . $char;
            if($char=='('){
                $br++;
            }elseif($char==')'){
                $br--;
            }elseif($char==' '){
                if($br===0){
                    $appearances[]=trim( $t );
                    $t='';
                }
            }
            if($br===0&&$i==strlen($appearance)-1){
                $appearances[]=trim( $t );
            }
        }
        return $appearances;
    }
    public static function getSubstrBetween($string,$start,$end){
        $matches = [];
        preg_match_all('/'.$start.'(.*?)'.$end.'/', $string, $matches);
        return sizeof($matches[1]) ? $matches[1][0] : '';
    }
    public static function replaceAppearanceSearchApi($appearance){
        $appearance = str_replace('boolean(', 'dm_func_boolean(', $appearance);
        $appearance = str_replace('number(', 'dm_func_number(', $appearance);
        $appearance = str_replace('sum(', 'dm_func_sum(', $appearance);
        $appearance = str_replace('avg(', 'dm_func_avg(', $appearance);
        $appearance = str_replace('min(', 'dm_func_min(', $appearance);
        $appearance = str_replace('max(', 'dm_func_max(', $appearance);
        $appearance = str_replace('multiple(', 'dm_func_multiple(', $appearance);
        $appearance = str_replace('replace(', 'dm_func_replace(', $appearance);
        $appearance = str_replace('is_empty(', 'dm_func_is_empty(', $appearance);
        $appearance = str_replace('matches(', 'dm_func_matches(', $appearance);
        $appearance = str_replace('is_number(', 'dm_func_is_number(', $appearance);
        $appearance = str_replace('eq(', 'dm_func_eq(', $appearance);
        $appearance = str_replace('and(', 'dm_func_and(', $appearance);
        $appearance = str_replace('or(', 'dm_func_or(', $appearance);
        $appearance = str_replace('gt(', 'dm_func_gt(', $appearance);
        $appearance = str_replace('lt(', 'dm_func_lt(', $appearance);
        $appearance = str_replace('number_format(', 'dm_func_number_format(', $appearance);
        $appearance = str_replace('string_format(', 'dm_func_string_format(', $appearance);
        $appearance = str_replace('abs(', 'dm_func_abs(', $appearance);
        $appearance = str_replace('guest_mode(', 'dm_func_guest_mode(', $appearance);
        $appearance = str_replace('str_which(', 'dm_func_str_which(', $appearance);
        $appearance = str_replace('str_count(', 'dm_func_str_count(', $appearance);
        $appearance = str_replace('str_sub(', 'dm_func_str_sub(', $appearance);
        $appearance = str_replace('str_extract(', 'dm_func_str_extract(', $appearance);
        $appearance = str_replace('str_length(', 'dm_func_str_length(', $appearance);
        $appearance = str_replace('str_trim(', 'dm_func_str_trim(', $appearance);
        $appearance = str_replace('str_to_upper(', 'dm_func_str_to_upper(', $appearance);
        $appearance = str_replace('str_to_lower(', 'dm_func_str_to_lower(', $appearance);
        $appearance = str_replace('str_locate(', 'dm_func_str_locate(', $appearance);
        $appearance = str_replace('now(', 'dm_func_now(', $appearance);
        $appearance = str_replace('time_format(', 'dm_func_time_format(', $appearance);
        $appearance = str_replace('str_to_time(', 'dm_func_str_to_time(', $appearance);
        $appearance = str_replace('difftime(', 'dm_func_difftime(', $appearance);
        $appearance = str_replace('if_else(', 'dm_func_if_else(', $appearance);
        return $appearance;
    }
    public static function rebuildCalculate($node, $formID) {
        $functions = ['count', 'sum', 'max'];
        $functionMatches = [];
        foreach ($functions as $func) {
            list($node['calculate'], $matches) = self::replaceFunction($node['calculate'], $func, "##".strtoupper($func)."-FUNCTION##");
            $functionMatches[$func] = $matches;
        }
        list($node['calculate'], $indexedRepeatFunction) = self::replaceFunction($node['calculate'], "indexed-repeat\( (.*?)\ , (.*?)\ ,(.*?)", "##INDEXED-REPEAT-FUNCTION##");
        preg_match_all("/pulldata\((.*)\)/", $node['calculate'], $pulldata);
        if($pulldata[1][0]) {
            if(strpos($pulldata[1][0], "rawquery")) {
                list($node['calculate'], $sqlSelectString1) = self::replaceFunction($node['calculate'], "'SELECT (.*?)'", self::SQL_SELECT_STRING);
                list($node['calculate'], $sqlSelectString2) = self::replaceFunction($node['calculate'], "'WITH RECURSIVE (.*?)'", self::SQL_SELECT_STRING);
                $sqlSelectString = $sqlSelectString1 && sizeof($sqlSelectString1[0]) > 0 ? $sqlSelectString1 : $sqlSelectString2;
            } else if(strpos($pulldata[1][0], "options")>0 || strpos($pulldata[1][0], "mapping")>0) {
                preg_match_all("/ \/" . $formID . self::REGEX_MATCH_ALL, $node['calculate'], $matches);
                $replacement = strpos($pulldata[1][0], "options")>0 ? ", '##REPEAT-ID##'" : ", string('" . trim($matches[0][0]) . "')";
                $node['calculate'] = str_replace($matches[0][0], $matches[0][0] . $replacement, $node['calculate']);
            }
        }
        $node['calculate'] = self::replaceJoinParams($node['calculate'], $formID);
        $node['calculate'] = self::replaceRef($node['calculate'], $node['ref']);
        $node['calculate'] = preg_replace('/position\((.*?)\)/', 'position(\'${1}\')', $node['calculate']);
        $node['calculate'] = self::replaceRefString($node['calculate'], $formID);
        
        $node['calculate'] = self::commonStringReplacements($node['calculate']);
        if($sqlSelectString[0]) {
            for($i=0; $i<sizeof($sqlSelectString[0]); $i++) {
                $node['calculate'] = preg_replace("/##SQL-SELECT-STRING##/", $sqlSelectString[0][$i], $node['calculate'],1);
            }
        }
        foreach ($functions as $func) {
            for($i=0; $i<sizeof($functionMatches[$func][1]); $i++) {
                $node['calculate'] = preg_replace("/##".strtoupper($func)."-FUNCTION##/", "{$func}(' ".$functionMatches[$func][1][$i]." ')", $node['calculate'],1);
            }
        }
        if($indexedRepeatFunction){
            $node['calculate'] = preg_replace("/##INDEXED-REPEAT-FUNCTION##/", "indexedRepeat(' ".$indexedRepeatFunction[1][0]." ',' ".$indexedRepeatFunction[2][0]." ',".$indexedRepeatFunction[3][0].")", $node['calculate'],1);
        }
        return $node['calculate'];
    }
    public static function rebuildRelevant($node, $formID) {
        preg_match_all("/join\(\/(.*?)\)/", $node['relevant'], $joinStr);
        
        preg_match_all("/'SELECT (.*?)'/", $node['relevant'], $sqlSelectString);
        preg_match_all("/sum\( (.*?)\ \)/", $node['relevant'], $sumFunction);
        for($i=0; $i<sizeof($sumFunction); $i++) {
            $node['relevant'] = preg_replace("/sum\( (.*?)\ \)/", "##SUM-FUNCTION##", $node['relevant']);
        }
        $node['relevant'] = preg_replace("/'SELECT (.*?)'/", self::SQL_SELECT_STRING, $node['relevant']);
        
        $node['relevant'] = self::replaceRef($node['relevant'], $node['ref']);
        preg_match_all("/count\( (.*?)\ \)/", $node['relevant'], $countFunction);
        for($i=0; $i<sizeof($countFunction); $i++) {
            $node['relevant'] = preg_replace("/count\( (.*?)\ \)/", "##COUNT-FUNCTION##", $node['relevant']);
        }
        $node['relevant'] = self::replaceRefString($node['relevant'], $formID);
        $node['relevant'] = self::commonStringReplacements($node['relevant']);
        if($node['type'] == 'string'){
            $node['relevant'] = str_replace('pulldata(', 'pulldataText(', $node['relevant']);
        }
        if(sizeof($sqlSelectString[0]) > 0 ){
                foreach ($sqlSelectString[0] as $key => $value) {
                    $node['relevant'] = preg_replace("/##SQL-SELECT-STRING##/i", $value, $node['relevant'],1);
                }
        }
        else{
            $node['relevant'] = $node['relevant'];
        }
        for($i=0; $i<sizeof($countFunction[1]); $i++) {
            $node['relevant'] = str_replace("##COUNT-FUNCTION##", "count(' ".$countFunction[1][$i]." ')", $node['relevant']);
        }
        for($i=0; $i<sizeof($sumFunction[1]); $i++) {
            $node['relevant'] = preg_replace("/##SUM-FUNCTION##/", "sum(' ".$sumFunction[1][$i]." ')", $node['relevant'],1);
        }
        return $node['relevant'];
    }
    public static function rebuildReadonly($node, $formID) {
        if($node['readonly'] === self::TRUE_FUNCTION){
            return true;
        }
        $node['readonly'] = self::replaceRef($node['readonly'], $node['ref']);
        $node['readonly'] = str_replace("openArgs.", "##openArgsDOT##", $node['readonly']);
        $node['readonly'] = str_replace("..", "##REPEAT-ID##", $node['readonly']);
        $node['readonly'] = str_replace(".", "##THISCONTROL##", $node['readonly']);
        $node['readonly'] = str_replace("##openArgsDOT##", "openArgs.", $node['readonly']);
        $node['readonly'] = preg_replace("/ \/" . $formID . self::REGEX_MATCH_ALL, 'expression("${0}")', $node['readonly']);
        $node['readonly'] = self::commonStringReplacements($node['readonly']);
        return $node['readonly'];
    }
    public static function rebuildItemset($node, $formID) {
        $node["itemset"]["query"] = self::replaceRef($node["itemset"]["query"], $node['ref']);
        $node["itemset"]["query"] = self::commonStringReplacements($node["itemset"]["query"]);
        
        return $node["itemset"]["query"];
    }
    public static function rebuildAppearances($node, $formID) {
        $newAppearance = array();
        foreach($node['appearances'] as $appearance) {
            preg_match_all("/'SELECT (.*?)'/", $appearance, $sqlSelectString);
            $appearance = preg_replace("/'SELECT (.*?)'/", self::SQL_SELECT_STRING, $appearance);
            $appearance = self::replaceRef($appearance, $node['ref']);
            $appearance = preg_replace("/ \/" . $formID . self::REGEX_MATCH_ALL, 'expression("${0}")', $appearance);
            $appearance = str_replace('format-date-time(', 'formatDateTime(', $appearance);
            $appearance = str_replace('function-icon(', 'functionIcon(', $appearance);
            $appearance = str_replace('style-button(', 'styleButton(', $appearance);
            $appearance = str_replace('question-type(', 'questionType(', $appearance);
            $appearance = str_replace('search-api(', 'searchApi(', $appearance);
            $appearance = str_replace('search-default-api(', 'searchDefaultApi(', $appearance);
            $appearance = str_replace('check-exam(', 'checkExam(', $appearance);
            $appearance = str_replace('selected-at(', 'selectedAt(', $appearance);
            $appearance = str_replace('default(', 'rtDefault(', $appearance);
            $appearance = str_replace('int(', 'rtParseInt(', $appearance);
            $appearance = str_replace('action-button(', 'actionButton(', $appearance);
            $appearance = str_replace('search-autocomplete-noedit-v2-join-dbs', 'searchAutocompleteNoeditV2JoinDbs', $appearance);
            $appearance = str_replace('timer-countup(', 'timerCountup(', $appearance);
            $appearance = str_replace('timer-countdown(', 'timerCountdown(', $appearance);
            $appearance = str_replace('search-autocomplete-noedit-v2', 'searchAutocompleteNoeditV2', $appearance);
            $appearance = str_replace('search-autocomplete-noedit', 'searchAutocompleteNoedit', $appearance);
            $appearance = str_replace('search-autocomplete-v2-dm', 'searchAutocompleteV2Dm', $appearance);
            $appearance = str_replace('search-dm', 'searchDm', $appearance);
            $appearance = str_replace('search-join-dbs', 'searchJoinDbs', $appearance);
            $appearance = str_replace('date-gt', 'dateGt', $appearance);
            $appearance = str_replace('date-lt', 'dateLt', $appearance);
            $appearance = str_replace('inday-time-gt', 'indayTimeGt', $appearance);
            $appearance = str_replace('inday-time-lt', 'indayTimeLt', $appearance);
            $appearance = str_replace(' and ', '&&', $appearance);
            $appearance = str_replace(' or ', '||', $appearance);
            $appearance = preg_replace('/if\(|if \(/', 'rtIf(', $appearance);
            // $appearance = str_replace('if', 'rtIf', $appearance);
            $appearance = str_replace('qr-api(', 'qrApi(', $appearance);
            $appearance = str_replace('auto-take(', 'autotakeGeo(', $appearance);
            $appearance = str_replace('navigate-button(', 'navigateButton(', $appearance);
            preg_match_all("/(.*?)-scroll-view\(\d+,\[(.*?)\]\)/", $appearance, $matches);
            if(self::startsWith($appearance,"searchApi") || self::startsWith($appearance,"searchDefaultApi")){
                $appearance = self::replaceAppearanceSearchApi($appearance);
			}
            if(sizeof($matches) === 3) {
                $appearance = str_replace($matches[2][0], "##REPLACEREF##/".$matches[2][0], $appearance);
            }
            if($sqlSelectString[0]) {
                for($i=0; $i<sizeof($sqlSelectString[0]); $i++) {
                    $appearance = str_replace(self::SQL_SELECT_STRING, $sqlSelectString[0][$i], $appearance);
                }
            }
            array_push($newAppearance, $appearance);
        }
        return $newAppearance;
    }
    public static function rebuildConstraint($node, $formID) {
        $extensions = [
            'jpg', 'jpeg', 'png', 'gif', 'bmp',
            'mp3', 'wav', 'flac', 'aac',
            'mp4', 'avi', 'mkv', 'mov',
            'pdf', 'docx', 'xlsx', 'txt',
            'js', 'html', 'css', 'py',
            'json', 'xml', 'csv', 'sql',
            'zip', 'rar', 'tar', 'gz',
            'pptx', 'key', 'gslides',
            'iso','db'
          ];
        $node['constraint'] = self::replaceRef($node['constraint'], $node['ref']);
        $node['constraint'] = self::replaceJoinFunction($node['constraint']);
        $node['constraint'] = self::replaceRegexFunction($node['constraint']);
        foreach ($extensions as $extension) {
            $pattern = ".$extension";
            $replacement = "##DOT" . strtoupper($extension) . "##";
            $node['constraint'] = str_replace($pattern, $replacement, $node['constraint']);
        }
        $node['constraint'] = str_replace('.=', '.==', $node['constraint']);
        $node['constraint'] = str_replace(".", "##THISCONTROL##", $node['constraint']);
        foreach ($extensions as $extension) {
            $pattern = "##DOT" . strtoupper($extension) . "##";
            $replacement = ".$extension";
            $node['constraint'] = str_replace($pattern, $replacement, $node['constraint']);
        }
        $node['constraint'] = preg_replace("/ \/" . $formID . self::REGEX_MATCH_ALL, 'expression("${0}")', $node['constraint']);
        $node['constraint'] = self::commonStringReplacements($node['constraint']);
        $node['constraint'] = str_replace('##BACKSLASH##', '\\\\', $node['constraint']);
        $node['constraint'] = str_replace('##DOT##', '.', $node['constraint']);
        return $node['constraint'];
    }
    public static function rebuildExamAnswer($node, $formID) {
        preg_match_all("/count\( (.*?)\ \)/", $node['examAnswer'], $countFunction);
        for($i=0; $i<sizeof($countFunction); $i++) {
            $node['examAnswer'] = preg_replace("/count\( (.*?)\ \)/", "##COUNT-FUNCTION##", $node['examAnswer']);
        }
        preg_match_all("/sum\( (.*?)\ \)/", $node['examAnswer'], $sumFunction);
        for($i=0; $i<sizeof($sumFunction); $i++) {
            $node['examAnswer'] = preg_replace("/sum\( (.*?)\ \)/", "##SUM-FUNCTION##", $node['examAnswer']);
        }
        preg_match_all("/max\( (.*?)\ \)/", $node['examAnswer'], $maxFunction);
        for($i=0; $i<sizeof($maxFunction); $i++) {
            $node['examAnswer'] = preg_replace("/max\( (.*?)\ \)/", "##MAX-FUNCTION##", $node['examAnswer']);
        }
        preg_match_all("/pulldata\((.*)\)/", $node['examAnswer'], $pulldata);
        if($pulldata[1][0]) {
            if(strpos($pulldata[1][0], "rawquery")) {
                preg_match_all("/'SELECT (.*?)'/", $node['examAnswer'], $sqlSelectString1);
                $node['examAnswer'] = preg_replace("/'SELECT (.*?)'/", self::SQL_SELECT_STRING, $node['examAnswer']);
                preg_match_all("/'WITH RECURSIVE (.*?)'/", $node['examAnswer'], $sqlSelectString2);
                $node['examAnswer'] = preg_replace("/'WITH RECURSIVE (.*?)'/", self::SQL_SELECT_STRING, $node['examAnswer']);
                $sqlSelectString = $sqlSelectString1 && sizeof($sqlSelectString1[0]) > 0 ? $sqlSelectString1 : $sqlSelectString2;
            } else if(strpos($pulldata[1][0], "options")>0) {
                preg_match_all("/ \/" . $formID . self::REGEX_MATCH_ALL, $node['examAnswer'], $optionsStr);
                $node['examAnswer'] = str_replace($optionsStr[0][0], $optionsStr[0][0] . ", '##REPEAT-ID##'", $node['examAnswer']);
            } else if(strpos($pulldata[1][0], "mapping")>0) {
                preg_match_all("/ \/" . $formID . self::REGEX_MATCH_ALL, $node['examAnswer'], $mappingStr);
                $node['examAnswer'] = str_replace($mappingStr[0][0], $mappingStr[0][0] . ", string('" . trim($mappingStr[0][0]) . "')", $node['examAnswer']);
            } 
        }
        $node['examAnswer'] = self::replaceJoinParams($node['examAnswer'], $formID);
        $node['examAnswer'] = self::replaceRef($node['examAnswer'], $node['ref']);
        $node['examAnswer'] = preg_replace('/position\((.*?)\)/', 'position(\'${1}\')', $node['examAnswer']);
        $node['examAnswer'] = self::replaceRefString($node['examAnswer'], $formID);
        $node['examAnswer'] = self::commonStringReplacements($node['examAnswer']);
        
        if($sqlSelectString[0]) {
            for($i=0; $i<sizeof($sqlSelectString[0]); $i++) {
                $node['examAnswer'] = preg_replace("/##SQL-SELECT-STRING##/", $sqlSelectString[0][$i], $node['examAnswer'],1);
            }
        }
        for($i=0; $i<sizeof($countFunction[1]); $i++) {
            $node['examAnswer'] = preg_replace("/##COUNT-FUNCTION##/", "count(' ".$countFunction[1][$i]." ')", $node['examAnswer'],1);
        }
        for($i=0; $i<sizeof($maxFunction[1]); $i++) {
            $node['examAnswer'] = preg_replace("/##MAX-FUNCTION##/", "max(' ".$maxFunction[1][$i]." ')", $node['examAnswer'],1);
        }
        for($i=0; $i<sizeof($sumFunction[1]); $i++) {
            $node['examAnswer'] = preg_replace("/##SUM-FUNCTION##/", "sum(' ".$sumFunction[1][$i]." ')", $node['examAnswer'],1);
        }
        return $node['examAnswer'];
    }
    public static function rebuildRequired($node, $formID) {
        if($node['required'] === self::TRUE_FUNCTION){
            return true;
        }
        preg_match_all("/'SELECT (.*?)'/",$node['required'], $sqlSelectString);
        $node['required'] = preg_replace("/'SELECT (.*?)'/", self::SQL_SELECT_STRING,$node['required']);
        $node['required'] = self::replaceRef($node['required'], $node['ref']);
        $node['required'] = str_replace("..", "##REPEAT-ID##", $node['required']);
        $node['required'] = str_replace(".db", "##DOT-DB##", $node['required']);
        $node['required'] = str_replace(".", "##THISCONTROL##", $node['required']);
        $node['required'] = preg_replace("/ \/" . $formID . self::REGEX_MATCH_ALL, 'expression("${0}")', $node['required']);
        $node['required'] = self::commonStringReplacements($node['required']);
        $node['required'] = str_replace("##DOT-DB##", ".db", $node['required']);
        if($sqlSelectString[0]) {
            for($i=0; $i<sizeof($sqlSelectString[0]); $i++) {
                $node['required'] = str_replace(self::SQL_SELECT_STRING, $sqlSelectString[0][$i], $node['required']);
            }
        }
        return $node['required'];
    }
    public static function replaceRef($string, $ref) {
        preg_match_all('/ \.\.\/(.*?)\ /', $string, $matches1);
        for($i=0; $i<sizeof($matches1[0]); $i++) {
            if(strlen($matches1[0][$i]) > 0) {
                preg_match_all('/\.\.\//', $matches1[0][$i], $matches2);
                $refArray = explode("/", $ref);
                $temp = explode("/", $matches1[0][$i]);
                for($j=0; $j<sizeof($matches2[0]); $j++) {
                    if(strlen($matches2[0][$j]) > 0) {
                        array_pop($refArray);
                        unset($temp[$j]);
                    }
                }
                $string = str_replace(trim($matches1[0][$i]), trim(implode("/", $refArray)) . "/" . trim(implode("/", $temp)), $string);
            }
        }
        return $string;
    }
    public static function replaceRefString($string, $formID) {
        preg_match_all("/' \/(.*?)\ '/", $string, $matches2);
        if(sizeof($matches2) && sizeof($matches2[0]) && sizeof($matches2[1])) {
            $string = str_replace($matches2[0][0], 'string("/' . $matches2[1][0] . '")', $string);
        }
        $string = preg_replace("/ \/" . $formID . self::REGEX_MATCH_ALL, 'expression(\'${0}\')', $string);
        return $string;
    }
    public static function replaceJoinParams($string, $formID) {
        preg_match_all("/join\((.*?)\)/", $string, $matches);
        if(sizeof($matches[0])) {
            for($i=0; $i < sizeof($matches[0]); $i++) {
                $temp = preg_replace("/ \/" . $formID . "(.[^\)])+/", 'expressionJoin(\'${0}\')', $matches[0][$i]);
                $temp = str_replace("' /", "'/", $temp);
                $temp = str_replace(" ')", "')", $temp);
                $string = str_replace($matches[0][$i], $temp, $string);
            }
        }
        return $string;
    }
    public static function replaceJoinFunction($functionStr) {
        if(strpos($functionStr, "and")>0){
            $arr = explode("and", $functionStr);
            foreach($arr as &$value) {
                if(strpos($value, "join(")>0){
                    $functionStr = $value;
                    preg_match_all("/join\([\s\S]+\[(.*?)\][\s\S]+\)/", $functionStr, $matches1);
                    $condition = $matches1[1][0];
                    $temp = str_replace("[".$condition."]", "", $functionStr);
                    $condition = self::replaceJoinCondition($condition);
    
                    preg_match_all("/join\((.*?)\)/", $temp, $matches2);
                    $seperator = explode(",", trim($matches2[1][0]))[0];
                    $ref = explode(",", trim($matches2[1][0]))[1];
    
    
                    $newJoinFunction = "join({$seperator},getValueList('{$ref}','{$condition}'))";
                    $temp = str_replace($matches2[0][0], $newJoinFunction, $temp);
                    $value = $temp ;
                }
            }
            return join("and",$arr);
        }
        preg_match_all("/join\([\s\S]+\[(.*?)\][\s\S]+\)/", $functionStr, $matches1);
        $condition = $matches1[1][0];
        $temp = str_replace("[".$condition."]", "", $functionStr);
        $condition = self::replaceJoinCondition($condition);
        preg_match_all("/join\((.*?)\)/", $temp, $matches2);
        $seperator = explode(",", trim($matches2[1][0]))[0];
        $ref = explode(",", trim($matches2[1][0]))[1];
        $newJoinFunction = "join({$seperator},getValueList('{$ref}','{$condition}'))";
        $temp = str_replace($matches2[0][0], $newJoinFunction, $temp);
        return $temp;
    }
    public static function replaceJoinCondition($condition) {
        $newCondition = str_replace("position(.)", "position(##REPEAT-ID##)", $condition);
        $newCondition = str_replace("position(current()/..)", "##COMPARE-WITH-ID##", $newCondition);
        $newCondition = str_replace("..", "##STEPBACK##", $newCondition);
        return $newCondition;
    }
    public static function replaceRegexFunction($functionStr) {
        if(preg_match('/regex\((.*?)\)/', $functionStr, $matches)) {
            $functionStr = str_replace("\\", "##BACKSLASH##", $functionStr);
            $functionStr = str_replace("##BACKSLASH##.", "##BACKSLASH####DOT##", $functionStr);
            return $functionStr;
        }
        return $functionStr;
    }
}