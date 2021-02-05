select 
USERS.M_LABEL as USER_LABEL, 
USERS.M_DESC as USER_DESC, 
GRPS.M_LABEL as GROUP_LABEL, 
case GRPS.M_TYPE when 0 then 'MX USER ADMINISTRATOR' when 1 then 'MX LICENCE ADMINISTRATOR' when 2 then 'MX RIGHTS ADMINISTRATOR' when 3 then 'MX MIDDLEWARE ADMINISTRATOR' when 4 then 'MX INSTALL' when 5 then 'MX GROUP' when 6 then 'MLC GROUP' when 7 then 'MLC RIGHTS ADMINISTRATOR' when 8 then 'ACTUATE RIGHTS ADMINISTRATOR' else ' ' end as GRP_ROLE_STR, 
case GRPD.M_BO_FO when 0 then 'Front Office Group' when 1 then 'P&L Control Group' when 2 then 'Processing Group' else ' ' end as GRP_TYPE_STR, 
GRPD.M_DESC as GRP_DESC

from MX_USER_GROUP_DBF USER_G 
left outer join MX_GROUP_DBF GRPS 
on GRPS.M_REFERENCE = USER_G.M_GROUP_ID 

inner join  MX_USER_DBF USERS 
on USER_G.M_USER_ID = USERS.M_REFERENCE 

left join TRN_GRPD_DBF GRPD 
on ltrim(rtrim(GRPD.M_LABEL)) = ltrim(rtrim(GRPS.M_LABEL)) 

where GRPD.M_LABEL =@GroupLabel:C and USERS.M_LABEL =@UserLabel:C