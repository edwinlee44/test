SELECT
M_RUN_ID      					AS M_RUN_ID     ,  
M_LEGL_AGRMT  		AS M_LEGL_AGRMT ,  
M_CTP         						AS M_CTP        ,  
M_AMNT_AGRED 	   AS M_AMNT_AGRED ,  
M_REQ_TYPE    		   AS M_REQ_TYPE   ,  
M_MOV_DIR     				AS M_MOV_DIR    ,  
M_COL_DIR     				AS M_COL_DIR    , 
M_OUR_MTM              AS M_OUR_MTM,
M_CTP_MTM     				AS M_CTP_MTM    ,  
M_CTP_OURIA   			AS M_CTP_OURIA  ,  
M_CTP_CTPIA   			AS M_CTP_CTPIA  ,  
M_OUR_OURIA   			AS M_OURIA  ,  
M_OUR_CTPIA   			AS M_CTPIA  ,  
M_CTP_SETL    				AS M_CTP_SETL   , 
M_OUR_SETL    			AS M_OUR_SETL   ,
M_OUR_IT      					AS M_OUR_IT     ,  
M_CCY         						AS M_CCY        ,  
M_RQDET_THLD  		AS M_RQDET_THLD,
M_RQDET_MTA				AS M_RQDET_MTA,
M_RQDET_UNIT        AS M_RQDET_UNIT 
FROM
COL_EXC_MR_FB_REP 
where M_REF_DATA=@MxDataSetKey:N
AND M_GLB_STAT <> 'Canceled'
AND M_MOV_DIR = 'Post'
AND M_H_GRP_DT= M_INS_DATE
