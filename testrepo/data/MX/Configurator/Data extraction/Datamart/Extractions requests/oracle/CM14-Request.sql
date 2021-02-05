select 
M_CONT_ID as ContID,
M_EVENT as Event,
M_EVENT_ID as EventID,
M_EXPO_ID as ExpoID,
M_GROUP_NAME as GroupName,
M_INVENT_ID as InventoryID,
M_RUN_BY as RunBy,
M_RUN_ID_FK as RunIdFK,
M_SCEN_NB as ScenNB,
M_START_TIME as StartTime,
M_USERNAME as Username,
M_VAL_DATE as ValuationDate
from 
COL_ORCH_AUD_FB_REP
where
M_REF_DATA=@MxDataSetKey:N