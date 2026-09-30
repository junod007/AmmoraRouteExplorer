\# Ammora Route Explorer



A read-only route and quote explorer built with the official Ammora SDK on GIWA Sepolia.



\## Overview



Ammora Route Explorer demonstrates a real integration with the Ammora Protocol SDK.



The application:



\- Loads a captured inventory of 60 Ammora pools on GIWA Sepolia.

\- Creates an `AmmoraRouteClient`.

\- Requests exact-input quotes through `quoteExactIn()`.

\- Exposes the quote through a local backend API.

\- Displays the returned route and quote information in a web UI.



This project is currently \*\*read-only\*\*. It does not execute swaps or request wallet signatures.



\## Architecture



```text

Frontend

&#x20;  |

&#x20;  | GET /api/quote

&#x20;  v

Local API Server

&#x20;  |

&#x20;  v

AmmoraRouteClient

&#x20;  |

&#x20;  v

Ammora SDK

&#x20;  |

&#x20;  v

GIWA Sepolia

