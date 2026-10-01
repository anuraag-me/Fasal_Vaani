// --- LIVE API CONFIGURATION ---
const GROQ_API_KEY = ""; // create new one, don't reuse old leaked one
const GROQ_URL = `https://api.groq.com/openai/v1/chat/completions`;
const USE_PROXY = false; // set true when you deploy backend
const PROXY_URL = "/api/groq";

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    const links = document.querySelectorAll('.nav-links li');
    links.forEach(link => link.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(event?.currentTarget) event.currentTarget.classList.add('active');
}

function changeLanguage(langCode) {
    const translateSelect = document.querySelector('.goog-te-combo');
    if(translateSelect) {
        translateSelect.value = langCode;
        translateSelect.dispatchEvent(new Event('change'));
    }
}

// --- HUGE VARIETY - 18 CATEGORIES, 300+ CROPS ---
const indianCrops = [
  "Cereals: Rice, Wheat, Maize, Sorghum (Jowar), Barley (Jau), Oats (Jai)",
  "Millets: Pearl Millet (Bajra), Finger Millet (Ragi), Foxtail Millet (Kangni), Barnyard Millet (Jhangora), Little Millet (Kutki), Kodo Millet (Kodon), Proso Millet (Barri), Browntop Millet, Sorghum Millet",
  "Pulses & Legumes: Chickpea (Chana), Pigeon Pea (Arhar / Tur), Black Gram (Urad), Green Gram (Moong), Lentil (Masoor), Field Pea (Matar), Kidney Bean (Rajma), Moth Bean (Matki), Horse Gram (Kulthi), Cowpea (Lobia), Lathyrus (Khesari), Rice Bean, Soybean, Velvet Bean",
  "Oilseeds: Groundnut (Moongfali), Mustard (Sarson), Rapeseed, Soybean, Sunflower (Surajmukhi), Sesame (Til), Safflower (Kusum), Castor (Arandi), Linseed (Alsi), Niger (Ramtil), Taramira",
  "Cash Crops: Sugarcane (Ganna), Cotton (Kapas), Jute (Pat), Tobacco (Tambaku), Sugar Beet",
  "Plantation Crops: Tea (Chai), Coffee, Rubber, Coconut (Nariyal), Arecanut (Supari), Cocoa, Oil Palm, Cashew (Kaju)",
  "Root & Tuber Vegetables: Potato (Aloo), Sweet Potato (Shakarkandi), Onion (Pyaz), Garlic (Lehsun), Carrot (Gajar), Radish (Mooli), Beetroot (Chukandar), Turnip (Shalgam), Yam (Jimikand), Elephant Foot Yam (Suran), Taro (Arbi), Cassava (Tapioca), Kohlrabi (Knol Khol), Spring Onion (Hara Pyaz)",
  "Leafy & Greens: Spinach (Palak), Amaranth (Chaulai), Fenugreek Leaves (Methi Saag), Mustard Greens (Sarson Saag), Cabbage (Patta Gobhi), Lettuce, Kale, Coriander (Dhania), Mint (Pudina), Curry Leaves (Kadi Patta), Dill (Sowa), Parsley, Celery, Drumstick Leaves (Moringa), Bathua, Poi Saag (Malabar Spinach), Water Spinach (Kalmi Saag)",
  "Fruit & Pod Vegetables: Tomato (Tamatar), Brinjal (Baingan), Okra (Bhindi), Cauliflower (Phool Gobhi), Broccoli, Capsicum (Shimla Mirch), Green Chilli (Hari Mirch), Cucumber (Kheera), Bitter Gourd (Karela), Bottle Gourd (Lauki), Ridge Gourd (Torai), Sponge Gourd (Tori / Gilki), Pumpkin (Kaddu), Ash Gourd (Petha), Snake Gourd (Chichinda), Pointed Gourd (Parwal), Ivy Gourd (Kundru), French Beans, Cluster Beans (Gawar), Broad Beans (Sem), Drumstick (Sahjan), Peas (Matar), Sweet Corn, Baby Corn, Mushroom, Jackfruit Raw (Kathal)",
  "Fruits - Tropical: Mango (Aam), Banana (Kela), Papaya (Papita), Guava (Amrood), Pineapple (Ananas), Jackfruit (Kathal), Watermelon (Tarbooj), Muskmelon (Kharbooja), Pomegranate (Anar), Custard Apple (Sitaphal), Soursop (Lakshman Phal), Wood Apple (Bel), Bael, Jamun, Ber, Litchi, Dragon Fruit, Kiwi, Passion Fruit",
  "Fruits - Citrus & Temperate: Orange (Santra), Sweet Lime (Mosambi), Lemon (Nimbu), Kinnow, Mandarin, Grapefruit, Apple (Seb), Grapes (Angoor), Strawberry, Pear (Nashpati), Peach (Aadu), Plum (Aloo Bukhara), Apricot (Khubani), Cherry, Fig (Anjeer), Date Palm (Khajoor), Avocado, Olive",
  "Flowers - Commercial & Pooja: Rose (Gulab), Marigold (Genda), Jasmine (Chameli / Mogra / Juhi), Lotus (Kamal), Hibiscus (Gudhal), Tuberose (Rajnigandha), Chrysanthemum (Guldaudi), Crossandra (Kanakambaram), Carnation, Gladiolus, Gerbera, Orchid, Anthurium, Lilium, Bird of Paradise",
  "Flowers - Seasonal & Garden: Sunflower (Surajmukhi), Zinnia, Dahlia, Petunia, Cosmos, Aster, Balsam, Portulaca, Periwinkle (Sadabahar), Bougainvillea, Ixora (Rangan), Night Blooming Jasmine (Raat Rani), Parijat (Harsingar), Kadam, Gulmohar, Amaltas, Kaner (Oleander), Aprajita, Allamanda, Morning Glory",
  "Spices & Condiments: Black Pepper (Kali Mirch), Cardamom (Elaichi), Cinnamon (Dalchini), Clove (Laung), Cumin (Jeera), Coriander Seed (Dhania), Fennel (Saunf), Fenugreek (Methi), Turmeric (Haldi), Ginger (Adrak), Garlic, Dry Chilli (Lal Mirch), Nutmeg (Jaiphal), Mace (Javitri), Bay Leaf (Tej Patta), Star Anise, Vanilla, Allspice, Asafoetida (Hing), Mustard Seed (Rai), Carom (Ajwain), Dill Seed, Curry Leaf, Saffron (Kesar)",
  "Medicinal & Aromatic: Tulsi (Holy Basil), Aloe Vera (Ghritkumari), Ashwagandha, Neem, Brahmi, Lemongrass, Mint, Shatavari, Giloy, Stevia, Isabgol, Safed Musli, Kalmegh, Sarpgandha, Chamomile, Lavender",
  "Fodder Crops: Berseem, Lucerne (Alfalfa), Maize Fodder, Sorghum Fodder (Chari), Napier Grass, Guinea Grass, Cowpea Fodder, Oats Fodder, Sudan Grass",
  "Other Crops: Betel Leaf (Paan), Curry Leaf Tree, Moringa (Drumstick), Fox Nuts (Makhana)",
  "Nuts & Dry Fruits: Almond (Badam), Cashew, Walnut (Akhrot), Pistachio (Pista), Coconut, Groundnut, Fox Nuts (Makhana)"
];

document.addEventListener("DOMContentLoaded", function() {
    const leafSelect = document.getElementById("leaf-crop-select");
    const soilSelect = document.getElementById("soil-crop-select");
    indianCrops.forEach(category => {
        let parts = category.split(": ");
        let groupName = parts[0];
        let items = parts[1].split(", ");
        let optGroupLeaf = document.createElement("optgroup");
        optGroupLeaf.label = groupName;
        let optGroupSoil = document.createElement("optgroup");
        optGroupSoil.label = groupName;
        items.forEach(item => {
            let optionLeaf = document.createElement("option");
            optionLeaf.value = item.toLowerCase();
            optionLeaf.textContent = item;
            let optionSoil = optionLeaf.cloneNode(true);
            if(leafSelect) optGroupLeaf.appendChild(optionLeaf);
            if(soilSelect) optGroupSoil.appendChild(optionSoil);
        });
        if(leafSelect) leafSelect.appendChild(optGroupLeaf);
        if(soilSelect) soilSelect.appendChild(optGroupSoil);
    });
    const chatInput = document.getElementById("chat-input");
    if(chatInput) {
        chatInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
        });
    }
});

async function callGroq(requestBody) {
    const url = USE_PROXY? PROXY_URL : GROQ_URL;
    const headers = { "Content-Type": "application/json" };
    if (!USE_PROXY) headers["Authorization"] = `Bearer ${GROQ_API_KEY}`;
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        const errData = await response.json().catch(()=>({}));
        throw new Error(errData.error?.message || `API Error ${response.status}`);
    }
    return response.json();
}

function previewImage(event) {
    const imageField = document.getElementById("leaf-preview");
    const reader = new FileReader();
    reader.onload = function() {
        if(reader.readyState === 2) {
            imageField.src = reader.result;
            imageField.style.display = "block";
            document.getElementById("leaf-upload-zone").style.borderColor = "#3A7342";
            document.getElementById("leaf-upload-zone").style.backgroundColor = "#F1F8E9";
        }
    }
    if (event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

async function analyzeLeaf() {
    const leafCrop = document.getElementById("leaf-crop-select").value;
    const fileInput = document.getElementById("leaf-upload");
    if(!leafCrop) { alert("Please select a plant/crop name first."); return; }
    if(fileInput.files.length === 0) { alert("Please upload an image first."); return; }
    const cropDisplay = leafCrop.charAt(0).toUpperCase() + leafCrop.slice(1);
    document.getElementById("leaf-results").classList.remove("hidden");
    document.getElementById("out-leaf-condition").innerHTML = `<li><i class="fa-solid fa-spinner fa-spin"></i> Analyzing...</li>`;
    document.getElementById("out-leaf-cure").innerHTML = `<li>Waiting...</li>`;
    try {
        const base64Image = await fileToBase64(fileInput.files[0]);
        const mimeType = fileInput.files[0].type;
        const requestBody = {
            model: "qwen/qwen3.8-27b",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: `You are an expert agronomist. Analyze this leaf image from a ${cropDisplay} plant. Output ONLY a raw JSON object with exactly three keys: "disease", "description", "cures" array of 3.` },
                    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
                ]
            }],
            temperature: 0.1
        };
        let data;
        try { data = await callGroq(requestBody); }
        catch (e) {
            if (e.message.includes("does not exist")) {
                requestBody.model = "qwen/qwen3-8b";
                data = await callGroq(requestBody);
            } else throw e;
        }
        let aiText = data.choices[0].message.content;
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI did not return valid JSON");
        const aiData = JSON.parse(jsonMatch[0]);
        document.getElementById("out-leaf-condition").innerHTML = `<li><strong>Plant:</strong> ${cropDisplay}</li><li><strong>Disease:</strong> ${aiData.disease}</li><li><strong>Description:</strong> ${aiData.description}</li>`;
        document.getElementById("out-leaf-cure").innerHTML = aiData.cures.map(c => `<li>${c}</li>`).join('');
    } catch (error) {
        document.getElementById("out-leaf-condition").innerHTML = `<li style="color:red"><b>Error:</b> ${error.message}</li>`;
        document.getElementById("out-leaf-cure").innerHTML = `<li>Diagnostic failed.</li>`;
    }
}

async function analyzeSoil() {
    const crop = document.getElementById("soil-crop-select").value;
    if(!crop) { alert("Please select a target crop first."); return; }
    const n = document.getElementById("soil-n").value || "Unknown";
    const p = document.getElementById("soil-p").value || "Unknown";
    const k = document.getElementById("soil-k").value || "Unknown";
    const ph = document.getElementById("soil-ph").value || "Unknown";
    const ec = document.getElementById("soil-ec").value || "Unknown";
    const oc = document.getElementById("soil-oc").value || "Unknown";
    const s = document.getElementById("soil-s").value || "Unknown";
    const zn = document.getElementById("soil-zn").value || "Unknown";
    const fe = document.getElementById("soil-fe").value || "Unknown";
    const cu = document.getElementById("soil-cu").value || "Unknown";
    const mn = document.getElementById("soil-mn").value || "Unknown";
    const b = document.getElementById("soil-b").value || "Unknown";
    document.getElementById("soil-results").classList.remove("hidden");
    document.getElementById("out-soil-condition").innerHTML = `<li><i class="fa-solid fa-spinner fa-spin"></i> Analyzing soil...</li>`;
    document.getElementById("out-soil-cure").innerHTML = `<li>Waiting...</li>`;
    try {
        const requestBody = {
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: `Analyze soil for ${crop}. N:${n} P:${p} K:${k} pH:${ph} EC:${ec} OC:${oc} S:${s} Zn:${zn} Fe:${fe} Cu:${cu} Mn:${mn} B:${b}. Output ONLY JSON with "problems" (2 strings) and "cures" (3 strings).` }],
            temperature: 0.1
        };
        const data = await callGroq(requestBody);
        let aiText = data.choices[0].message.content;
        const aiData = JSON.parse(aiText.match(/\{[\s\S]*\}/)[0]);
        document.getElementById("out-soil-condition").innerHTML = aiData.problems.map(p=>`<li>${p}</li>`).join('');
        document.getElementById("out-soil-cure").innerHTML = aiData.cures.map(c=>`<li>${c}</li>`).join('');
    } catch (error) {
        document.getElementById("out-soil-condition").innerHTML = `<li style="color:red"><b>Error:</b> ${error.message}</li>`;
    }
}

async function sendMessage() {
    const inputField = document.getElementById("chat-input");
    const messageText = inputField.value.trim();
    if(!messageText) return;
    const chatHistory = document.getElementById("chat-history");
    chatHistory.insertAdjacentHTML('beforeend', `<div class="chat-bubble user-bubble"><strong>You:</strong><br>${messageText}</div>`);
    inputField.value = "";
    const typing = document.createElement("div");
    typing.className = "chat-bubble ai-bubble";
    typing.innerHTML = `<strong>Fasal Guru:</strong><br><i class="fa-solid fa-spinner fa-spin"></i>`;
    chatHistory.appendChild(typing);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    try {
        const requestBody = {
            model: "openai/gpt-oss-20b",
            messages: [
                { role: "system", content: "You are Fasal Guru, expert Indian farming assistant. Reply in user's language. Use <br> and <strong>." },
                { role: "user", content: messageText }
            ],
            temperature: 0.5
        };
        const data = await callGroq(requestBody);
        typing.innerHTML = `<strong>Fasal Guru:</strong><br>${data.choices[0].message.content}`;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    } catch (error) {
        typing.innerHTML = `<strong>Fasal Guru:</strong><br><span style="color:red"><b>Error:</b> ${error.message}</span>`;
    }
}

function downloadPDF(type) {
    const container = document.getElementById('pdf-container');
    const template = document.getElementById('pdf-template');
    container.style.display = 'block';
    document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    if(type === 'leaf') {
        document.getElementById('pdf-crop').innerText = (document.getElementById("leaf-crop-select").value.toUpperCase() || "UNSPECIFIED");
        document.getElementById('pdf-problem').innerHTML = `<ul>${document.getElementById('out-leaf-condition').innerHTML}</ul>`;
        document.getElementById('pdf-cure').innerHTML = `<ul>${document.getElementById('out-leaf-cure').innerHTML}</ul>`;
    } else {
        document.getElementById('pdf-crop').innerText = (document.getElementById("soil-crop-select").value.toUpperCase() || "UNSPECIFIED");
        document.getElementById('pdf-problem').innerHTML = `<ul>${document.getElementById('out-soil-condition').innerHTML}</ul>`;
        document.getElementById('pdf-cure').innerHTML = `<ul>${document.getElementById('out-soil-cure').innerHTML}</ul>`;
    }
    const opt = { margin:[0.5,0.5,0.5,0.5], filename:`FasalVaani_${type}_Report.pdf`, image:{type:'jpeg',quality:1}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'} };
    html2pdf().set(opt).from(template).save().then(()=> container.style.display='none');
}