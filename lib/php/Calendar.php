<?php
class Calendar {
	/**
	 *
	 * @deprecated 生成日历的各个边界值
	 * @param string $year        	
	 * @param string $month        	
	 * @return array
	 */
	public function threshold($year, $month) {
		$firstDay = mktime ( 0, 0, 0, $month, 1, $year );
		$lastDay = strtotime ( '+1 month -1 day', $firstDay );
		// 取得天数
		$days = date ( "t", $firstDay );
		// 取得第一天是星期几
		$firstDayOfWeek = date ( "N", $firstDay );
		// 获得最后一天是星期几
		$lastDayOfWeek = date ( 'N', $lastDay );
		
		// 上一个月最后一天
		$lastMonthDate = strtotime ( '-1 day', $firstDay );
		$lastMonthOfLastDay = date ( 'd', $lastMonthDate );
		// 下一个月第一天
		$nextMonthDate = strtotime ( '+1 day', $lastDay );
		$nextMonthOfFirstDay = strtotime ( '+1 day', $lastDay );
		
		// 日历的第一个日期
		if ($firstDayOfWeek == 7)
			$firstDate = $firstDay;
		else
			$firstDate = strtotime ( '-' . $firstDayOfWeek . ' day', $firstDay );
			// 日历的最后一个日期
		if ($lastDayOfWeek == 6)
			$lastDate = $lastDay;
		elseif ($lastDayOfWeek == 7)
			$lastDate = strtotime ( '+6 day', $lastDay );
		else
			$lastDate = strtotime ( '+' . (6 - $lastDayOfWeek) . ' day', $lastDay );
		
		return array (
				'days' => $days,
				'firstDayOfWeek' => $firstDayOfWeek,
				'lastDayOfWeek' => $lastDayOfWeek,
				'lastMonthOfLastDay' => $lastMonthOfLastDay,
				'firstDate' => $firstDate,
				'lastDate' => $lastDate,
				'year' => $year,
				'month' => $month 
		);
	}
	
	/**
	 *
	 * @author Pwstrick
	 *         　　　* @param array $calendar 通过threshold方法计算后的数据
	 * @deprecated 计算日历的天数与样式
	 */
	public function caculate($calendar) {
		$days = $calendar ['days'];
		$firstDayOfWeek = $calendar ['firstDayOfWeek']; // 本月第一天的星期
		$lastDayOfWeek = $calendar ['lastDayOfWeek']; // 本月最后一天的星期
		$lastMonthOfLastDay = $calendar ['lastMonthOfLastDay']; // 上个月的最后一天
		$year = $calendar ['year'];
		$month = $calendar ['month'];
		
		$dates = array ();
		if ($firstDayOfWeek != 7) {
			$lastDays = array ();
			$current = $lastMonthOfLastDay; // 上个月的最后一天
			for($i = 0; $i < $firstDayOfWeek; $i ++) {
				array_push ( $lastDays, $current ); // 添加上一个月的日期天数
				$current --;
			}
			$lastDays = array_reverse ( $lastDays ); // 反序
			foreach ( $lastDays as $index => $day ) {
				array_push ( $dates, array (
						'day' => 0,
						'isrest' => ($index == 0 ? 1 : 0),
						'isoutter' => 1 
				) );
			}
		}
		
		// 本月日历信息
		for($i = 1; $i <= $days; $i ++) {
			$isRest = $this->_checkIsRest ( $year, $month, $i );
			// 判断是否是休息天
			array_push ( $dates, array (
					'day' => $i,
					'isrest' => ($isRest ? 1 : 0),
					'isoutter' => 0 
			) );
		}
		
		// 下月日历信息
		if ($lastDayOfWeek == 7) { // 最后一天是星期日
			$length = 6;
		} elseif ($lastDayOfWeek == 6) { // 最后一天是星期六
			$length = 0;
		} else {
			$length = 6 - $lastDayOfWeek;
		}
		for($i = 1; $i <= $length; $i ++) {
			array_push ( $dates, array (
					'day' => 0,
					'isrest' => ($i == $length ? 1 : 0),
					'isoutter' => 1 
			) );
		}
		
		return $dates;
	}
	
	/**
	 *
	 * @author Pwstrick
	 * @param array $caculate
	 *        	通过caculate方法计算后的数据
	 * @deprecated 画表格，设置table中的tr与td
	 */
	public function draw($caculate) {
		$tr = array ();
		$length = count ( $caculate );
		$result = array ();
		foreach ( $caculate as $index => $date ) {
			if ($index % 7 == 0) { // 第一列
				$tr = array (
						$date 
				);
			} elseif ($index % 7 == 6 || $index == ($length - 1)) {
				array_push ( $tr, $date );
				array_push ( $result, $tr ); // 添加到返回的数据中
				$tr = array (); // 清空数组列表
			} else {
				array_push ( $tr, $date );
			}
		}
		return $result;
	}
	private function _checkIsRest ( $year, $month, $day ){
		$w = date('w',strtotime($year.'-'.$month.'-'.$day));
		if ($w == 6 || $w == 0) {
			return true;
		}
		return false;
	}
	/**
	 * 获取当月的最后一天
	 * @return string
	 */
	public function getLastdayOfThisMonth(){
		$today = date('Y-m-d');
		$firstDay = date('Y-m-01',strtotime($today));
		$lastDay = date('Y-m-d', strtotime("$firstDay+1 month -1 day"));
		return $lastDay;
	}
	/**
	 * 获取指定月份最后一天
	 * @param number $year
	 * @param number $month
	 * @return string
	 */
	public function getLastDayOfGivenMonth($year=0, $month=0){
		$year = $year ? $year : date('Y');
		$month = $month ? $month : date('m');
		$day = date('Y-m-d',strtotime($year.'-'.$month.'-1'));
		$firstDay = date('Y-m-01',strtotime($day));
		$lastDay = date('Y-m-d', strtotime("$firstDay+1 month -1 day"));
		return $lastDay;
	}

    /**
     * 只获取指定月份最后一天
     * @param number $year
     * @param number $month
     * @return string
     */
    public function getLastSingleDayOfGivenMonth($year=0, $month=0){
        $year = $year ? $year : date('Y');
        $month = $month ? $month : date('m');
        $day = date('Y-m-d',strtotime($year.'-'.$month.'-1'));
        $firstDay = date('Y-m-01',strtotime($day));
        $lastDay = date('d', strtotime("$firstDay+1 month -1 day"));
        return $lastDay;
    }
}
