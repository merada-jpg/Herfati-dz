import { EstimateItem } from '../types';

export const ESTIMATE_ITEMS: EstimateItem[] = [
  {id:'paint_f3',trade:'painting',titleAr:'طلاء شقة كاملة F3 (جدران وأسقف)',titleFr:'Peinture complète appartement F3 (murs & plafonds)',unit:'شقة (Appt)',laborRateDzd:38000,materialsRateDzd:28000,minQuantity:1,defaultQuantity:1},
  {id:'tile_floor',trade:'masonry',titleAr:'تركيب بلاط أرضي دال دو صول (Dalle de sol)',titleFr:'Pose carrelage / dalle de sol au mètre carré',unit:'متر مربع (m²)',laborRateDzd:950,materialsRateDzd:1800,minQuantity:10,defaultQuantity:40},
  {id:'faience_wall',trade:'masonry',titleAr:'تركيب فايونس حمام ومطبخ (Faïence)',titleFr:'Pose faïence cuisine et salle de bain',unit:'متر مربع (m²)',laborRateDzd:1100,materialsRateDzd:2200,minQuantity:5,defaultQuantity:25},
  {id:'water_tank_pump',trade:'plumbing',titleAr:'تركيب خزان ماء سيتيرنة (1000L) مع مضخة وبالون',titleFr:'Installation citerne 1000L + suppresseur et ballon',unit:'وحدة (Unité)',laborRateDzd:12000,materialsRateDzd:42000,minQuantity:1,defaultQuantity:1},
  {id:'water_heater_install',trade:'plumbing',titleAr:'تركيب أو استبدال سخان ماء غازي (Chauffe-eau)',titleFr:'Pose ou remplacement chauffe-eau à gaz',unit:'جهاز (Appareil)',laborRateDzd:4500,materialsRateDzd:24000,minQuantity:1,defaultQuantity:1},
  {id:'electrical_panel',trade:'electrical',titleAr:'تركيب وتوصيل لوحة قواطع كهربائية (Tableau électrique)',titleFr:'Installation tableau modulaire et disjoncteurs',unit:'لوحة (Tableau)',laborRateDzd:9000,materialsRateDzd:16000,minQuantity:1,defaultQuantity:1},
  {id:'split_ac_install',trade:'appliances',titleAr:'تركيب مكيف هواء سبليت (Climatiseur 12000/18000 BTU)',titleFr:'Installation climatiseur split complet avec support',unit:'مكيف (Clim)',laborRateDzd:6500,materialsRateDzd:7000,minQuantity:1,defaultQuantity:1},
  {id:'kitchen_cupboards_wood',trade:'carpentry',titleAr:'تفصيل وتركيب خزانة مطبخ عصرية خشب أو MDF',titleFr:'Fabrication et pose éléments de cuisine MDF / Bois',unit:'متر طولي (Mètre linéaire)',laborRateDzd:8000,materialsRateDzd:15000,minQuantity:2,defaultQuantity:4},
  {id:'window_aluminum',trade:'carpentry',titleAr:'صناعة وتركيب نافذة ألمنيوم زجاج مزدوج (Fenêtre Alu)',titleFr:'Fabrication fenêtre aluminium double vitrage',unit:'نافذة (Fenêtre)',laborRateDzd:6000,materialsRateDzd:18000,minQuantity:1,defaultQuantity:2},
  {id:'armored_door_lock',trade:'locksmith',titleAr:'تركيب قفل أمان متعدد النقاط لباب شقة',titleFr:'Installation serrure sécurité multipoints blindée',unit:'قفل (Serrure)',laborRateDzd:4000,materialsRateDzd:11000,minQuantity:1,defaultQuantity:1}
];