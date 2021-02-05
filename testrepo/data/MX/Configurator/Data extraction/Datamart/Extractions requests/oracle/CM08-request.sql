//CM08 - Margin Call Report

SELECT 
    FDR6c.M_CTP AS Counterparty,
    FDR6c.M_LEGL_AGRMT AS Collateral_agreement,
    FDR6c.M_VAL_DATE AS Valuation_date,
    FDR6c.M_TYPE AS Object_type,
    FDR6c.M_BASE_ID AS ID,
    FDR6c.M_VERSION AS Version,
    FDR6c.M_MOV_DIR AS Direction,
    FDR6c.M_COL_DIR AS Nature,
    FDR6c.M_REQ_TYPE AS Requirement_type,
    FDR6c.M_REQ_CCY AS Currency,
    FDR6c.M_AMNT_AGRED AS Agreed_amount,
    CAST (CASE RTRIM(FDR6c.M_REQ_STAT) WHEN 'Partially Alloc' THEN 'Partially Allocated' ELSE FDR6c.M_REQ_STAT END AS VARCHAR (20)) AS Requirement_status,
    FDR6c.M_PORTFOLIO AS Account,
    FDR6c.M_INSTRUMENT AS Instrument,
    FDR6c.M_QUANTITY AS Quantity,
    FDR6c.M_FX_RATE AS FX_Rate,
    CASE FDR6c.M_ASSET_TYPE WHEN 'Currency' THEN null ELSE FDR6c.M_PRICE END AS Price,
    FDR6c.M_HAIRCUT AS Haircut,
    FDR6c.M_AS_COL_VAL AS Collateral_value,
    FDR6c.M_SETTLEDATE AS Value_date,
    FDR6c.M_ASSET_TYPE AS Asset_type,
    FDR6c.M_CONTEXT AS Agreement_type
   
FROM 
    COL_EXC_ALLOC_FB_REP FDR6c
    LEFT JOIN COL_PARTIES_FB_REP FDR3 ON (FDR3.M_CTP_LABEL=FDR6c.M_CTP AND FDR3.M_REF_DATA=FDR6c.M_REF_DATA)
    LEFT JOIN COL_ORCH_AUD_FB_REP FDR9 ON (FDR6c.M_RUN_ID=FDR9.M_RUN_ID_FK AND FDR6c.M_REF_DATA=FDR9.M_REF_DATA)

WHERE
    FDR6c.M_REF_DATA=@MxDataSetKey:N
    AND (FDR6c.M_TYPE='Margin call' OR FDR6c.M_TYPE='Expected margin call')
    AND FDR6c.M_GLB_STAT <> 'Canceled'
    AND trunc(M__DT_IN_TS) = trunc(sysdate)