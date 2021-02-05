select M_BD_INUM,M_BD_TGS_CMW,M_BD_MAT

from BD_BOND_DBF

WHERE M_BD_INUM in (select M_SE_INUM from SE_MKTOP_DBF where M_SE_LABEL in (

select M_SE_LABEL from SE_HEAD_DBF where M_SE_GROUP='Bond' and M_SE_TYPE in ('Callable') and 
M_BD_MAT >to_date ('20200813','YYYYMMDD')))
