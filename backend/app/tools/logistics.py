from langchain_core.tools import tool

SENT_APOLOGIES = set()

@tool(description="Retrieves current shipping status from the carrier API.")
def get_shipping_status(order_id: str) -> str:
    order_id_upper = order_id.upper()
    statuses = {
        "ORD-001": "On Time - In Transit",
        "ORD-002": "Delayed - Weather conditions in Memphis hub",
        "ORD-003": "Delivered"
    }
    
    status = statuses.get(order_id_upper, "Order ID not found.")
    
    if order_id_upper in SENT_APOLOGIES:
        return f"{status} (Apology Sent)"
        
    return status