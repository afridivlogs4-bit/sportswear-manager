(() => {
  const PRODUCTS = [
    ["normal_uniform","Normal Uniform","sets"],
    ["goalkeeper_set","Goalkeeper Set","sets"],
    ["t_shirt","T-Shirt","pieces"],
    ["basketball_set","Basketball Set","sets"],
    ["soccer_ball","Soccer Ball","pieces"],
    ["goalkeeper_gloves","Goalkeeper Gloves","pairs"],
    ["hoodie","Hoodie","pieces"],
    ["backpack","Backpack","pieces"]
  ];
  const KEY = "rrsportsmanager_multi_items_v1";
  const money = n => Number(n || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  function start(){
    if(document.getElementById("rrsm-multi-items")) return;
    const host = document.querySelector("main") || document.querySelector("#app") || document.querySelector(".app") || document.body;
    const card = document.createElement("section");
    card.id = "rrsm-multi-items";
    card.innerHTML = `
      <style>
        #rrsm-multi-items{font-family:inherit;color:#17243b;margin:18px 0;padding:20px;background:#fff;border:1px solid #dce4ef;border-radius:16px;box-shadow:0 5px 18px rgba(16,29,51,.06)}
        #rrsm-multi-items *{box-sizing:border-box}
        #rrsm-multi-items .rr-head{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
        #rrsm-multi-items h2{font-size:20px;margin:0;color:#14233d}
        #rrsm-multi-items p{font-size:13px;color:#64748b;margin:6px 0 16px}
        #rrsm-multi-items .rr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}
        #rrsm-multi-items .rr-item{border:1px solid #e2e8f0;border-radius:11px;padding:12px;background:#f8fafc}
        #rrsm-multi-items .rr-item label{display:block;font-weight:650;font-size:13px;margin-bottom:8px}
        #rrsm-multi-items input{width:100%;min-height:40px;border:1px solid #cbd5e1;border-radius:8px;padding:8px 10px;background:white;font:inherit;color:#17243b}
        #rrsm-multi-items .rr-price{display:none;margin-top:8px}
        #rrsm-multi-items .rr-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}
        #rrsm-multi-items button{border:0;border-radius:9px;padding:10px 15px;background:#1d4ed8;color:white;font-weight:650;cursor:pointer}
        #rrsm-multi-items button.rr-muted{background:#e8eef7;color:#1e293b}
        #rrsm-multi-items .rr-total{margin-top:14px;padding:14px;border-radius:10px;background:#eff6ff;font-weight:700;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
        #rrsm-multi-items .rr-about{border-top:1px solid #e2e8f0;margin-top:20px;padding-top:16px}
        #rrsm-multi-items .rr-about h3{font-size:15px;margin:0 0 7px}
        #rrsm-multi-items .rr-about p{margin:0;line-height:1.6}
      </style>
      <div class="rr-head"><h2>Team Order — Products & Quantities</h2><span style="font-size:11px;font-weight:700;color:#1d4ed8">RRSPORTSMANAGER</span></div>
      <p>Select all products the team needs and enter total sets or pieces. You can add prices later when the order is finalized.</p>
      <div class="rr-grid" id="rrsm-product-grid"></div>
      <div class="rr-actions">
        <button type="button" id="rrsm-save">Save quantities</button>
        <button type="button" class="rr-muted" id="rrsm-pricing-toggle">Finalize order & set prices</button>
        <button type="button" class="rr-muted" id="rrsm-clear">Clear quantities</button>
      </div>
      <div id="rrsm-pricing-note" style="display:none;margin-top:15px">
        <p><b>Final pricing:</b> enter each product's price per set, piece or pair. Leave unselected products at zero.</p>
      </div>
      <div class="rr-total"><span>Total items selected: <b id="rrsm-count">0</b></span><span>Order total: <b id="rrsm-total">Price not set</b></span></div>
      <div class="rr-about">
        <h3>About RRSPORTSMANAGER</h3>
        <p>RRSPORTSMANAGER is built to make sportswear ordering and production easier, clearer and more organized. Our commitment is to quality, dependable service and attention to every team’s requirements. Proudly led by owners <b>Sikandar Mallhi</b> and <b>M. Ibrahim</b>.</p>
      </div>`;
    host.prepend(card);
    const grid = card.querySelector("#rrsm-product-grid");
    PRODUCTS.forEach(([id,label,unit]) => {
      const saved = read()[id] || {};
      const el = document.createElement("div");
      el.className="rr-item";
      el.innerHTML=`<label for="rrsm-q-${id}">${label} <span style="font-weight:400;color:#64748b">(${unit})</span></label>
        <input id="rrsm-q-${id}" type="number" min="0" step="1" inputmode="numeric" placeholder="Enter quantity" value="${saved.qty || ""}">
        <div class="rr-price"><input id="rrsm-p-${id}" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Unit price" value="${saved.price || ""}"></div>`;
      grid.appendChild(el);
    });
    const read = () => { try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}} };
    function collect(){
      const data={};
      PRODUCTS.forEach(([id])=>{
        data[id]={qty:Math.max(0,Number(card.querySelector("#rrsm-q-"+id).value)||0),price:Math.max(0,Number(card.querySelector("#rrsm-p-"+id)?.value)||0)};
      });
      return data;
    }
    function render(){
      const d=collect(); let count=0,total=0,hasQty=false,hasPrice=false;
      PRODUCTS.forEach(([id])=>{count+=d[id].qty;if(d[id].qty>0){hasQty=true;if(d[id].price>0){hasPrice=true;total+=d[id].qty*d[id].price;}}});
      card.querySelector("#rrsm-count").textContent=count;
      card.querySelector("#rrsm-total").textContent=hasQty&&hasPrice?money(total):"Price not set";
    }
    const save=()=>{localStorage.setItem(KEY,JSON.stringify(collect()));render();};
    card.querySelectorAll("input").forEach(i=>i.addEventListener("input",render));
    card.querySelector("#rrsm-save").addEventListener("click",()=>{save();alert("Product quantities saved on this device.");});
    card.querySelector("#rrsm-pricing-toggle").addEventListener("click",()=>{
      card.querySelectorAll(".rr-price").forEach(x=>x.style.display="block");
      card.querySelector("#rrsm-pricing-note").style.display="block";
      card.querySelector("#rrsm-pricing-toggle").textContent="Save final prices";
      card.querySelector("#rrsm-pricing-toggle").onclick=()=>{save();alert("Final product prices saved on this device.");};
    });
    card.querySelector("#rrsm-clear").addEventListener("click",()=>{
      if(!confirm("Clear all product quantities and prices?"))return;
      localStorage.removeItem(KEY);
      PRODUCTS.forEach(([id])=>{card.querySelector("#rrsm-q-"+id).value="";card.querySelector("#rrsm-p-"+id).value="";});
      render();
    });
    render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();