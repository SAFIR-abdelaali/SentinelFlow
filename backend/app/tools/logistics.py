from langchain_core.tools import tool

@tool
def get_shipping_status(order_id: str) -> str:
    """Retrieves current shipping status from the carrier API."""
    statuses = {
        "ORD-001": "On Time - In Transit",
        "ORD-002": "Delayed - Weather conditions in Memphis hub",
        "ORD-003": "Delivered"
    }
    return statuses.get(order_id.upper(), "Order ID not found.")