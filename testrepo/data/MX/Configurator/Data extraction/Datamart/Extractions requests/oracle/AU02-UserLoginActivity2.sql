
--AU02-UserLoginActivity2

/*
Selection of users connections with concreate group. No services connection are returned.
to return service connection rows as well, please comment the last 'where and' condition for this part only.
*/
select

USERS.M_LABEL as USER_LABEL,
USER_CONN.M_GROUP_NAME as GROUP_NAME,
case USERS.M_PUB_PASS when 0 then 'YES' else 'NO' end as USER_IS_PASS_PRV, 
to_char(USERS.M_PASS_CD) as USER_PASS_CD,
USERS.M_DESC as USER_DESC, 
case USER_CONN.M_EVENT_TYPE when 0 then 'FAILED' else 'SUCCESS' end as CONN_STATUS, 
USER_CONN.M_EVENT_DESC as CONN_LOGIN_MSG, 
case USERS.M_LOCKED when 0 then ' ' when 1 then 'IS LOCKED' end as USER_INFO, 
USER_CONN.M_STAT_IP as CONN_MACHINE_IP, 
USER_CONN.M_STAT_NAME as CONN_MACHINE_NAME,
to_char(USER_CONN.M_LOGOUT_DATE,'MON DD YYYY')  as CONN_LOGOUT_DATE, 
to_char(USER_CONN.M_EVENT_DATE,'MON DD YYYY') as CONN_LOGIN_DATE,
to_char(USER_CONN.M_EVENT_DATE,'HH24:MI:SS') as CONN_LOGIN_TIME,
USER_CONN.M_SESSION_TP
from 
MX_USER_DBF USERS left join  MX_USER_CONNECTION_DBF USER_CONN  on USERS.M_LABEL = USER_CONN.M_USER_NAME 

where 

USER_CONN.M_EVENT_DATE >=@FirstDate_Greater_or_equal_to:D and USER_CONN.M_EVENT_DATE <=@SecondDate_Less_than_or_equal_to:D 
and USERS.M_LABEL=@UserLabel:C
AND  

NOT (NVL(USER_CONN.M_STAT_NAME, ' ') =  '172.16.229.12' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = ' ')
AND  NOT(NVL(USER_CONN.M_STAT_NAME, ' ') = 'MUXAP1' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = '172.16.229.16')
AND  NOT(NVL(USER_CONN.M_STAT_NAME, ' ') = 'MUXAP1' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = 'MX')
AND  NOT(NVL(USER_CONN.M_STAT_NAME, ' ') = ' ' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = ' ' AND USERS.M_LABEL='ITOP001' AND USER_CONN.M_EVENT_DESC ='Successful Logon')
/*20180110 YINGING SUG*/
AND M_SESSION_TP= 'MX_SESSION'  
--AND M_GROUP_NAME IS NOT NULL

-- and USER_CONN.M_GROUP_NAME is not null

union 

/*
Selection of users connections with bad user name input
*/

select 
USER_CONN.M_USER_NAME as USER_LABEL,
USER_CONN.M_GROUP_NAME as GROUP_NAME,
'NO' as USER_IS_PASS_PRV, 
' ' as USER_PASS_CD,  
' ' as USER_DESC, 
case USER_CONN.M_EVENT_TYPE when 0 then 'FAILED' else 'SUCCESS' end as CONN_STATUS, 
USER_CONN.M_EVENT_DESC as CONN_LOGIN_MSG, 
'NOT IN DATABASE' as USER_INFO ,  
USER_CONN.M_STAT_IP as CONN_MACHINE_IP,  
USER_CONN.M_STAT_NAME as CONN_MACHINE_NAME, 
to_char(USER_CONN.M_LOGOUT_DATE,'MON DD YYYY')  as CONN_LOGOUT_DATE, 
to_char(USER_CONN.M_EVENT_DATE,'MON DD YYYY') as CONN_LOGIN_DATE,
to_char(USER_CONN.M_EVENT_DATE,'HH24:MI:SS') as CONN_LOGIN_TIME, 
USER_CONN.M_SESSION_TP
from
MX_USER_CONNECTION_DBF USER_CONN 

where 

USER_CONN.M_EVENT_DATE >=@FirstDate_Greater_or_equal_to:D and USER_CONN.M_EVENT_DATE <=@SecondDate_Less_than_or_equal_to:D
and USER_CONN.M_USER_NAME=@UserLabel:C
and 


USER_CONN.M_USER_NAME  NOT IN (select M_LABEL from MX_USER_DBF USERS)
AND  NOT (NVL(USER_CONN.M_STAT_NAME, ' ') =  '172.16.229.12' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = ' ')
AND  NOT(NVL(USER_CONN.M_STAT_NAME, ' ') = 'MUXAP1' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = '172.16.229.16')
AND  NOT(NVL(USER_CONN.M_STAT_NAME, ' ') = 'MUXAP1' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = 'MX')
AND  NOT(NVL(USER_CONN.M_STAT_NAME, ' ') = ' ' AND NVL(TRIM(USER_CONN.M_STAT_IP), ' ') = ' ' AND USER_CONN.M_USER_NAME='ITOP001' AND USER_CONN.M_EVENT_DESC ='Successful Logon')
/*20180110 YINGING SUG*/
AND M_SESSION_TP= 'MX_SESSION'  
--AND M_GROUP_NAME IS NOT NULL

-- and USER_CONN.M_GROUP_NAME is null