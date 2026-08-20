import React, { useState, useEffect, useRef } from 'react';
import { CakeItem } from '../types';

interface CustomCakeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomCakeToCart: (cake: CakeItem, customizationText: string) => void;
}

// Color option palette for custom cake frosting
interface ColorOption {
  id: string;
  name: string;
  color: string;
  darkColor: string;
  spongeColor: string;
  fillingColor: string;
}

const COLOR_PALETTE: ColorOption[] = [
  { id: 'red-velvet', name: 'Royal Red Velvet', color: '#8b4b58', darkColor: '#5a2d36', spongeColor: '#7a2d3d', fillingColor: '#f9f3ea' },
  { id: 'dark-choco', name: 'Belgian Dark Ganache', color: '#4a2e22', darkColor: '#281710', spongeColor: '#2d1b14', fillingColor: '#5c392c' },
  { id: 'vanilla-bean', name: 'Ivory Vanilla Bean', color: '#f5e8d0', darkColor: '#cbb692', spongeColor: '#edd8b1', fillingColor: '#fff9ee' },
  { id: 'rose-pistachio', name: 'Rose Water Pistachio', color: '#8ba48b', darkColor: '#5b735b', spongeColor: '#7d967d', fillingColor: '#f2eae1' },
  { id: 'strawberry', name: 'Blossom Pink', color: '#e2979c', darkColor: '#b06167', spongeColor: '#e08a8d', fillingColor: '#fff0f1' },
  { id: 'mocha', name: 'Yirgacheffe Coffee', color: '#5e4336', darkColor: '#36241b', spongeColor: '#473127', fillingColor: '#d6beab' },
  { id: 'lavender', name: 'Lavender Violet', color: '#a393bf', darkColor: '#6f5e8c', spongeColor: '#9685b3', fillingColor: '#f5f0fb' },
  { id: 'matcha', name: 'Matcha Blossom', color: '#97a97c', darkColor: '#637549', spongeColor: '#87986c', fillingColor: '#f3f6ee' },
  { id: 'midnight', name: 'Midnight Charcoal', color: '#333742', darkColor: '#1a1d24', spongeColor: '#242730', fillingColor: '#e2e4e8' },
  { id: 'pastel-blue', name: 'Sky Powder Blue', color: '#9bb8d3', darkColor: '#6987a3', spongeColor: '#8ca9c4', fillingColor: '#f0f5fa' },
  { id: 'champagne-gold', name: 'Champagne Gold', color: '#d4af37', darkColor: '#9c7d1e', spongeColor: '#e0c265', fillingColor: '#fffdf5' },
];

const FINISHES = ['Smooth Satin', 'Rustic Texture', 'Edible Gold Dust', 'Semi-Naked Sponge'];
const DRIPS = ['None', 'Dark Chocolate Ganache', 'Gold Leaf Drip', 'Salted Caramel', 'Strawberry Glaze'];

const PEDESTAL_STYLES = [
  { id: 'marble', name: 'Marble & Brass', fill1: '#e5ded9', fill2: '#ffffff', stroke: '#c5b8b0' },
  { id: 'gold', name: 'Royal Gold Tray', fill1: '#c9a037', fill2: '#f3e5ab', stroke: '#96731c' },
  { id: 'silver', name: 'Vintage Silver', fill1: '#a3a8b0', fill2: '#e2e5e9', stroke: '#737780' },
  { id: 'wood', name: 'Rustic Walnut Wood', fill1: '#4a3429', fill2: '#735243', stroke: '#2e1f18' },
];

const PIPING_STYLES = ['Classic Shell', 'Pearl Border', 'Smooth Bevel', 'Gold Ribbon Edge'];

const TOPPERS = [
  { id: 'grad', label: '🎓 Graduation Cap', icon: '🎓' },
  { id: 'wedding', label: '💍 Diamond Ring', icon: '💍' },
  { id: 'candle', label: '🕯️ Birthday Candle', icon: '🕯️' },
  { id: 'roses', label: '🌸 Fresh Roses', icon: '🌸' },
  { id: 'crown', label: '👑 Gold Crown', icon: '👑' },
  { id: 'balloons', label: '🎈 Balloons', icon: '🎈' },
  { id: 'dove', label: '🕊️ Dove / Peace', icon: '🕊️' },
  { id: 'none', label: '🚫 No Topper', icon: '' },
];

const ACCENTS = ['French Macarons', 'Gold Leaf Foil', 'Edible Pearls', 'Fresh Strawberries', 'Rainbow Sprinkles'];

export interface EventOccasion {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  tiers: number;
  topColor: ColorOption;
  middleColor: ColorOption;
  baseColor: ColorOption;
  topper: string;
  finish: string;
  drip: string;
  inscription: string;
  accents: string[];
  pedestal: string;
  piping: string;
  plaqueBg: 'fondant' | 'gold' | 'chocolate';
}

const EVENT_OCCASIONS: EventOccasion[] = [
  {
    id: 'graduation',
    name: 'Graduation Ceremony',
    icon: '🎓',
    badge: 'Academic Honors',
    description: 'Regal 3-tier celebratory bake with gold leaf drip, academic cap topper, and gold plaque.',
    tiers: 3,
    topColor: COLOR_PALETTE[0], // Red Velvet
    middleColor: COLOR_PALETTE[1], // Dark Choco
    baseColor: COLOR_PALETTE[10], // Champagne Gold
    topper: '🎓',
    finish: 'Smooth Satin',
    drip: 'Gold Leaf Drip',
    inscription: 'Congratulations Class of 2026!',
    accents: ['Gold Leaf Foil', 'Edible Pearls'],
    pedestal: 'marble',
    piping: 'Pearl Border',
    plaqueBg: 'gold',
  },
  {
    id: 'wedding',
    name: 'Royal Wedding & Engagement',
    icon: '💍',
    badge: 'Bridal Romance',
    description: 'Ivory vanilla bean tiers dusted in edible gold, topped with diamond ring icon.',
    tiers: 3,
    topColor: COLOR_PALETTE[2], // Vanilla
    middleColor: COLOR_PALETTE[3], // Rose Pistachio
    baseColor: COLOR_PALETTE[2], // Vanilla
    topper: '💍',
    finish: 'Edible Gold Dust',
    drip: 'None',
    inscription: 'Forever & Always | 2026',
    accents: ['Fresh Strawberries', 'Edible Pearls'],
    pedestal: 'gold',
    piping: 'Gold Ribbon Edge',
    plaqueBg: 'fondant',
  },
  {
    id: 'birthday',
    name: 'Milestone Birthday Party',
    icon: '🕯️',
    badge: 'Birthday Celebration',
    description: 'Vibrant party tiers with chocolate drip, birthday candle topper, and macarons.',
    tiers: 2,
    topColor: COLOR_PALETTE[4], // Blossom Pink
    middleColor: COLOR_PALETTE[9], // Sky Blue
    baseColor: COLOR_PALETTE[6], // Lavender
    topper: '🕯️',
    finish: 'Rustic Texture',
    drip: 'Dark Chocolate Ganache',
    inscription: 'Happy Birthday Sarah!',
    accents: ['French Macarons', 'Rainbow Sprinkles'],
    pedestal: 'silver',
    piping: 'Classic Shell',
    plaqueBg: 'chocolate',
  },
  {
    id: 'crown',
    name: 'Royal Crown Gala',
    icon: '👑',
    badge: 'Luxury Royalty',
    description: 'Opulent dark ganache & midnight charcoal with gold leaf trim and crown topper.',
    tiers: 3,
    topColor: COLOR_PALETTE[1], // Dark Choco
    middleColor: COLOR_PALETTE[8], // Midnight
    baseColor: COLOR_PALETTE[10], // Champagne Gold
    topper: '👑',
    finish: 'Edible Gold Dust',
    drip: 'Gold Leaf Drip',
    inscription: 'Long Live the Queen!',
    accents: ['Gold Leaf Foil', 'Edible Pearls'],
    pedestal: 'gold',
    piping: 'Gold Ribbon Edge',
    plaqueBg: 'gold',
  },
  {
    id: 'babyshower',
    name: 'Baby Shower & Gender Reveal',
    icon: '🍼',
    badge: 'New Arrival',
    description: 'Soft pastel powder blue & blossom pink layers with sweet ribbon border.',
    tiers: 2,
    topColor: COLOR_PALETTE[9], // Sky Blue
    middleColor: COLOR_PALETTE[2], // Vanilla
    baseColor: COLOR_PALETTE[4], // Blossom Pink
    topper: '🎈',
    finish: 'Smooth Satin',
    drip: 'Strawberry Glaze',
    inscription: 'Welcome Little Miracle!',
    accents: ['French Macarons', 'Rainbow Sprinkles'],
    pedestal: 'marble',
    piping: 'Pearl Border',
    plaqueBg: 'fondant',
  },
  {
    id: 'anniversary',
    name: 'Anniversary & Romance',
    icon: '💖',
    badge: 'Romantic Love',
    description: 'Rose water pistachio & velvet red layers with fresh roses and salted caramel.',
    tiers: 2,
    topColor: COLOR_PALETTE[0], // Red Velvet
    middleColor: COLOR_PALETTE[3], // Rose Pistachio
    baseColor: COLOR_PALETTE[0], // Red Velvet
    topper: '🌸',
    finish: 'Smooth Satin',
    drip: 'Salted Caramel',
    inscription: 'Happy 10th Anniversary!',
    accents: ['Fresh Strawberries', 'Gold Leaf Foil'],
    pedestal: 'marble',
    piping: 'Pearl Border',
    plaqueBg: 'chocolate',
  },
  {
    id: 'victory',
    name: 'Corporate & Victory Award',
    icon: '🏆',
    badge: 'Achievement',
    description: 'Sleek dark ganache and champagne gold finish designed for corporate galas.',
    tiers: 3,
    topColor: COLOR_PALETTE[8], // Midnight
    middleColor: COLOR_PALETTE[10], // Champagne Gold
    baseColor: COLOR_PALETTE[1], // Belgian Dark
    topper: '👑',
    finish: 'Smooth Satin',
    drip: 'Gold Leaf Drip',
    inscription: 'Congratulations Team Ethiopia!',
    accents: ['Gold Leaf Foil', 'French Macarons'],
    pedestal: 'silver',
    piping: 'Gold Ribbon Edge',
    plaqueBg: 'gold',
  },
];

const PRESETS = [
  {
    name: 'Graduation Celebration',
    tiers: 3,
    topColor: COLOR_PALETTE[0], // Red Velvet
    middleColor: COLOR_PALETTE[1], // Dark Choco
    baseColor: COLOR_PALETTE[2], // Vanilla
    topper: '🎓',
    finish: 'Smooth Satin',
    drip: 'Gold Leaf Drip',
    inscription: 'Congratulations Class of 2026!',
    accents: ['Gold Leaf Foil', 'Edible Pearls'],
    pedestal: 'marble',
    piping: 'Pearl Border',
  },
  {
    name: 'Royal Wedding Elegance',
    tiers: 3,
    topColor: COLOR_PALETTE[3], // Rose Pistachio
    middleColor: COLOR_PALETTE[2], // Vanilla
    baseColor: COLOR_PALETTE[3], // Rose Pistachio
    topper: '💍',
    finish: 'Edible Gold Dust',
    drip: 'None',
    inscription: 'Forever & Always',
    accents: ['Fresh Strawberries', 'Edible Pearls'],
    pedestal: 'gold',
    piping: 'Gold Ribbon Edge',
  },
  {
    name: 'Midnight Birthday',
    tiers: 2,
    topColor: COLOR_PALETTE[1], // Dark Choco
    middleColor: COLOR_PALETTE[5], // Mocha
    baseColor: COLOR_PALETTE[8], // Midnight
    topper: '👑',
    finish: 'Rustic Texture',
    drip: 'Dark Chocolate Ganache',
    inscription: 'Happy 30th Birthday!',
    accents: ['French Macarons', 'Gold Leaf Foil'],
    pedestal: 'silver',
    piping: 'Classic Shell',
  },
  {
    name: 'Pastel Garden Party',
    tiers: 2,
    topColor: COLOR_PALETTE[4], // Blossom Pink
    middleColor: COLOR_PALETTE[9], // Sky Blue
    baseColor: COLOR_PALETTE[6], // Lavender
    topper: '🌸',
    finish: 'Smooth Satin',
    drip: 'Strawberry Glaze',
    inscription: 'Best Wishes!',
    accents: ['French Macarons', 'Rainbow Sprinkles'],
    pedestal: 'marble',
    piping: 'Smooth Bevel',
  },
];

export const CustomCakeBuilderModal: React.FC<CustomCakeBuilderModalProps> = ({
  isOpen,
  onClose,
  onAddCustomCakeToCart,
}) => {
  // State
  const [tiers, setTiers] = useState<number>(3);
  
  // Event Occasion State
  const [selectedOccasionId, setSelectedOccasionId] = useState<string>('graduation');

  // Custom Color Selection per Tier
  const [topColorOption, setTopColorOption] = useState<ColorOption>(COLOR_PALETTE[0]);
  const [middleColorOption, setMiddleColorOption] = useState<ColorOption>(COLOR_PALETTE[1]);
  const [baseColorOption, setBaseColorOption] = useState<ColorOption>(COLOR_PALETTE[2]);

  const [finish, setFinish] = useState('Smooth Satin');
  const [drip, setDrip] = useState('Gold Leaf Drip');
  const [topperIcon, setTopperIcon] = useState<string>('🎓');
  const [selectedAccents, setSelectedAccents] = useState<string[]>(['Gold Leaf Foil', 'Edible Pearls']);

  const [pedestalStyle, setPedestalStyle] = useState('marble');
  const [pipingStyle, setPipingStyle] = useState('Pearl Border');

  const [inscription, setInscription] = useState('Congratulations Class of 2026!');
  const [plaqueBg, setPlaqueBg] = useState<'fondant' | 'gold' | 'chocolate'>('gold');
  const [guests, setGuests] = useState(30);

  // Event Custom Field Inputs
  const [gradYear, setGradYear] = useState('2026');
  const [gradSchool, setGradSchool] = useState('Addis Ababa University');
  const [coupleNames, setCoupleNames] = useState('Beni & Henok');
  const [birthdayName, setBirthdayName] = useState('Sarah');
  const [birthdayAge, setBirthdayAge] = useState('25');

  // 3D Studio Camera State
  const [viewMode, setViewMode] = useState<'3d' | 'slice' | 'top'>('3d');
  const [yawAngle, setYawAngle] = useState<number>(25);
  const [tiltAngle, setTiltAngle] = useState<number>(22);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'warm' | 'cool'>('studio');
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'event' | 'layers' | 'decor' | 'stand' | 'inscription' | 'preset'>('event');

  // Interactive Tier Selection State
  const [selectedTierKey, setSelectedTierKey] = useState<'top' | 'middle' | 'base' | null>('top');
  const [slicePercent, setSlicePercent] = useState<number>(25);
  const [showOrbitHint, setShowOrbitHint] = useState<boolean>(true);

  // Dragging state
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Tactile audio feedback
  const playTactileFeedback = (freq = 440, duration = 0.04) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback safe
    }
  };

  // Auto spin effect
  useEffect(() => {
    let interval: any;
    if (isAutoSpin && viewMode === '3d') {
      interval = setInterval(() => {
        setYawAngle((prev) => (prev + 1.2) % 360);
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isAutoSpin, viewMode]);

  if (!isOpen) return null;

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setYawAngle((prev) => (prev + deltaX * 0.5) % 360);
    setTiltAngle((prev) => Math.max(10, Math.min(45, prev - deltaY * 0.3)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Toggle accents
  const toggleAccent = (acc: string) => {
    playTactileFeedback(520, 0.05);
    if (selectedAccents.includes(acc)) {
      setSelectedAccents(selectedAccents.filter((a) => a !== acc));
    } else {
      if (selectedAccents.length < 3) {
        setSelectedAccents([...selectedAccents, acc]);
      }
    }
  };

  // Apply preset
  const applyPreset = (preset: typeof PRESETS[0] | any) => {
    playTactileFeedback(600, 0.08);
    setTiers(preset.tiers);
    setTopColorOption(preset.topColor);
    setMiddleColorOption(preset.middleColor);
    setBaseColorOption(preset.baseColor);
    setTopperIcon(preset.topper);
    setFinish(preset.finish);
    setDrip(preset.drip);
    setInscription(preset.inscription);
    setSelectedAccents(preset.accents);
    setPedestalStyle(preset.pedestal || 'marble');
    setPipingStyle(preset.piping || 'Pearl Border');
  };

  // Apply Event Occasion Theme
  const applyOccasionTheme = (occ: EventOccasion) => {
    playTactileFeedback(600, 0.08);
    setSelectedOccasionId(occ.id);
    setTiers(occ.tiers);
    setTopColorOption(occ.topColor);
    setMiddleColorOption(occ.middleColor);
    setBaseColorOption(occ.baseColor);
    setTopperIcon(occ.topper);
    setFinish(occ.finish);
    setDrip(occ.drip);
    setInscription(occ.inscription);
    setSelectedAccents(occ.accents);
    setPedestalStyle(occ.pedestal);
    setPipingStyle(occ.piping);
    setPlaqueBg(occ.plaqueBg);
  };

  const activeOccasion = EVENT_OCCASIONS.find((o) => o.id === selectedOccasionId) || EVENT_OCCASIONS[0];

  // Pricing math
  const baseTierPrice = tiers * 700;
  const finishAddon = finish === 'Edible Gold Dust' ? 450 : finish === 'Rustic Texture' ? 200 : 0;
  const dripAddon = drip !== 'None' ? 250 : 0;
  const topperAddon = topperIcon ? 300 : 0;
  const accentAddon = selectedAccents.length * 150;
  const guestAddon = Math.max(0, guests - 20) * 25;

  const totalPrice = baseTierPrice + finishAddon + dripAddon + topperAddon + accentAddon + guestAddon;
  const depositPrice = Math.round(totalPrice * 0.5);

  const handleFinishCustomBuild = () => {
    playTactileFeedback(880, 0.15);
    const customCake: CakeItem = {
      id: `custom-cake-${Date.now()}`,
      code: '#3D-STUDIO-BUILD',
      name: `Custom ${tiers}-Tier ${topColorOption.name} Bake`,
      category: 'Tiered Cakes',
      price: totalPrice,
      rating: 5.0,
      reviewCount: 1,
      soldCount: 1,
      revenue: totalPrice,
      stockCount: 1,
      stockStatus: 'In Stock',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiB02ZGBONY2ukSkvpk_NnuwF-j6lFzGx3gL2bcfFKKNov4rS1Ar1ueuB0dv3D1VvbJ7Zs7DYjcFBDhA5MsECz4KkPhgYiI-t3Lm-23NwCijID6CwhTyirN4aD-fQIQZGFYa9yshixh7n3rtSooS3qRsVKxluwmIwXKBPSXBwC96ed7yYyUMkb7Re9W7gTNbXUlVahD-BaYedy9BuQu3Gnw0Y4DVS4zdJVT_8ZsqxLI4G2Veb7gubKLw',
      altText: `Custom 3D ${tiers}-Tier Cake`,
      description: `Handcrafted ${tiers}-Tier cake (${finish}, ${drip}). Top: ${topColorOption.name}, Base: ${baseColorOption.name}. Topper: ${topperIcon || 'None'}. Inscription: "${inscription}". Accents: ${selectedAccents.join(', ') || 'None'}. Serves ${guests} guests.`,
      isPopular: true,
    };

    const details = `Custom ${tiers}-Tier Build | Top: ${topColorOption.name}, Base: ${baseColorOption.name} | Finish: ${finish} | Topper: ${topperIcon || 'None'} | Inscription: "${inscription}" | ${guests} Guests | 50% Deposit: ${depositPrice} ETB`;
    onAddCustomCakeToCart(customCake, details);
    onClose();
  };

  const selectedPedestal = PEDESTAL_STYLES.find((p) => p.id === pedestalStyle) || PEDESTAL_STYLES[0];

  // Math-based SVG rendering for a solid 3D tier cylinder
  const renderCylinderTier = (
    centerX: number,
    topY: number,
    radius: number,
    height: number,
    colorOpt: ColorOption,
    label: string,
    tierKey: 'top' | 'middle' | 'base'
  ) => {
    const ry = radius * Math.sin((tiltAngle * Math.PI) / 180) * 0.45;
    const dripColor =
      drip === 'Gold Leaf Drip'
        ? '#d4af37'
        : drip === 'Dark Chocolate Ganache'
        ? '#2a1610'
        : drip === 'Salted Caramel'
        ? '#c67d30'
        : '#e63946';

    const uniqueId = `cyl-${colorOpt.id}-${radius}-${topY}`;
    const isSelected = selectedTierKey === tierKey;

    return (
      <g
        key={`${label}-${topY}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTierKey(tierKey);
          playTactileFeedback(650, 0.05);
          setActiveTab('layers');
        }}
        className="transition-all duration-300 cursor-pointer group"
      >
        <defs>
          <linearGradient id={`${uniqueId}-wall`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorOpt.darkColor} />
            <stop offset="30%" stopColor={colorOpt.color} />
            <stop offset="55%" stopColor="#ffffff" stopOpacity={finish === 'Smooth Satin' ? 0.35 : 0.15} />
            <stop offset="70%" stopColor={colorOpt.color} />
            <stop offset="100%" stopColor={colorOpt.darkColor} />
          </linearGradient>

          <radialGradient id={`${uniqueId}-cap`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="45%" stopColor={colorOpt.color} />
            <stop offset="100%" stopColor={colorOpt.darkColor} />
          </radialGradient>

          <linearGradient id={`${uniqueId}-drip`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={dripColor} />
            <stop offset="100%" stopColor={dripColor} stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Shadow under cylinder */}
        <ellipse
          cx={centerX}
          cy={topY + height + ry * 0.8}
          rx={radius * 1.05}
          ry={ry * 1.05}
          fill="#000000"
          opacity="0.16"
          filter="blur(4px)"
        />

        {/* Selected Tier Glow Outline behind wall */}
        {isSelected && (
          <path
            d={`
              M ${centerX - radius - 4} ${topY}
              A ${radius + 4} ${ry + 2} 0 0 0 ${centerX + radius + 4} ${topY}
              L ${centerX + radius + 4} ${topY + height + 2}
              A ${radius + 4} ${ry + 2} 0 0 1 ${centerX - radius - 4} ${topY + height + 2}
              Z
            `}
            fill="#6b3541"
            opacity="0.3"
            filter="blur(2px)"
          />
        )}

        {/* Cylinder Front Curved Wall */}
        <path
          d={`
            M ${centerX - radius} ${topY}
            A ${radius} ${ry} 0 0 0 ${centerX + radius} ${topY}
            L ${centerX + radius} ${topY + height}
            A ${radius} ${ry} 0 0 1 ${centerX - radius} ${topY + height}
            Z
          `}
          fill={`url(#${uniqueId}-wall)`}
          stroke={isSelected ? '#ffffff' : 'none'}
          strokeWidth={isSelected ? '2' : '0'}
        />

        {/* Semi-Naked Sponge Band */}
        {finish === 'Semi-Naked Sponge' && (
          <path
            d={`
              M ${centerX - radius * 0.98} ${topY + height * 0.4}
              A ${radius * 0.98} ${ry * 0.95} 0 0 0 ${centerX + radius * 0.98} ${topY + height * 0.4}
              L ${centerX + radius * 0.98} ${topY + height * 0.65}
              A ${radius * 0.98} ${ry * 0.95} 0 0 1 ${centerX - radius * 0.98} ${topY + height * 0.65}
              Z
            `}
            fill="#edd8b1"
            opacity="0.8"
          />
        )}

        {/* Gold Leaf Foil Accents on Wall */}
        {selectedAccents.includes('Gold Leaf Foil') && (
          <g>
            {[-0.6, -0.3, 0.1, 0.5, 0.7].map((offset, idx) => (
              <polygon
                key={idx}
                points={`
                  ${centerX + radius * offset},${topY + height * (0.3 + (idx % 3) * 0.2)}
                  ${centerX + radius * offset + 6},${topY + height * (0.3 + (idx % 3) * 0.2) - 4}
                  ${centerX + radius * offset + 10},${topY + height * (0.3 + (idx % 3) * 0.2) + 2}
                  ${centerX + radius * offset + 3},${topY + height * (0.3 + (idx % 3) * 0.2) + 6}
                `}
                fill="#ffd700"
                opacity="0.9"
              />
            ))}
          </g>
        )}

        {/* Drips Along Front Rim */}
        {drip !== 'None' && (
          <g>
            <path
              d={`
                M ${centerX - radius} ${topY}
                A ${radius} ${ry} 0 0 0 ${centerX + radius} ${topY}
                Q ${centerX + radius * 0.6} ${topY + 12} ${centerX + radius * 0.45} ${topY + 16}
                Q ${centerX + radius * 0.25} ${topY + 6} ${centerX} ${topY + 14}
                Q ${centerX - radius * 0.3} ${topY + 18} ${centerX - radius * 0.55} ${topY + 10}
                Q ${centerX - radius * 0.8} ${topY + 16} ${centerX - radius} ${topY}
                Z
              `}
              fill={`url(#${uniqueId}-drip)`}
            />
          </g>
        )}

        {/* Decorative Piping Trim along bottom rim */}
        {pipingStyle === 'Pearl Border' && (
          <g>
            {[-0.8, -0.5, -0.2, 0.1, 0.4, 0.7].map((pos, idx) => (
              <ellipse
                key={idx}
                cx={centerX + radius * pos}
                cy={topY + height + ry * 0.4}
                rx={6}
                ry={4}
                fill="#ffffff"
                stroke={colorOpt.darkColor}
                strokeWidth="0.5"
                opacity="0.9"
              />
            ))}
          </g>
        )}

        {pipingStyle === 'Gold Ribbon Edge' && (
          <path
            d={`
              M ${centerX - radius} ${topY + height}
              A ${radius} ${ry} 0 0 0 ${centerX + radius} ${topY + height}
              L ${centerX + radius} ${topY + height + 3}
              A ${radius} ${ry} 0 0 1 ${centerX - radius} ${topY + height + 3}
              Z
            `}
            fill="#d4af37"
          />
        )}

        {/* Edible Pearls Accents on Cap Rim */}
        {selectedAccents.includes('Edible Pearls') && (
          <g>
            {[-0.7, -0.4, -0.1, 0.2, 0.5, 0.8].map((pos, idx) => (
              <circle
                key={idx}
                cx={centerX + radius * pos}
                cy={topY + ry * 0.3}
                r="3.5"
                fill="#fff9ee"
                stroke="#d4af37"
                strokeWidth="0.8"
              />
            ))}
          </g>
        )}

        {/* Top Oval Cap */}
        <ellipse
          cx={centerX}
          cy={topY}
          rx={radius}
          ry={ry}
          fill={`url(#${uniqueId}-cap)`}
          stroke={isSelected ? '#6b3541' : '#ffffff'}
          strokeOpacity={isSelected ? '0.9' : '0.4'}
          strokeWidth={isSelected ? '2.5' : '1.5'}
        />

        {/* French Macaron Accents on Tier Cap */}
        {selectedAccents.includes('French Macarons') && (
          <g transform={`translate(${centerX + radius * 0.4}, ${topY - ry * 0.2})`}>
            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#e2979c" stroke="#ffffff" strokeWidth="0.8" />
            <ellipse cx="0" cy="-3" rx="8" ry="5" fill="#f8ebe6" />
            <ellipse cx="6" cy="2" rx="8" ry="5" fill="#97a97c" stroke="#ffffff" strokeWidth="0.8" />
          </g>
        )}

        {/* Fresh Strawberries Accents on Tier Cap */}
        {selectedAccents.includes('Fresh Strawberries') && (
          <g transform={`translate(${centerX - radius * 0.4}, ${topY - ry * 0.2})`}>
            <text x="0" y="4" fontSize="14" textAnchor="middle">🍓</text>
          </g>
        )}

        {/* Rainbow Sprinkles Accents on Tier Cap */}
        {selectedAccents.includes('Rainbow Sprinkles') && (
          <g>
            {[-0.5, -0.2, 0.1, 0.3].map((pos, idx) => (
              <line
                key={idx}
                x1={centerX + radius * pos}
                y1={topY - 2}
                x2={centerX + radius * pos + 6}
                y2={topY + 3}
                stroke={['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'][idx % 5]}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}

        {/* Label Text on Cylinder Front */}
        <text
          x={centerX}
          y={topY + height * 0.58}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.5"
          style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.7)', userSelect: 'none' }}
        >
          {isSelected ? `► ${label} ◄` : label}
        </text>

        {/* Selection Indicator Chip */}
        {isSelected && (
          <g transform={`translate(${centerX}, ${topY + height * 0.2})`}>
            <rect x="-35" y="-9" width="70" height="18" rx="9" fill="#6b3541" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              EDITING
            </text>
          </g>
        )}
      </g>
    );
  };

  // Dynamically compute exact Top Cap Y coordinate for Topper anchoring
  let topCapY = 190;
  let topCapRadius = 115;
  if (tiers === 3) {
    topCapY = 70;
    topCapRadius = 65;
  } else if (tiers === 2) {
    topCapY = 125;
    topCapRadius = 88;
  } else {
    topCapY = 180;
    topCapRadius = 115;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 select-none animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d7c1c4] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Sleek Professional Header */}
        <div className="px-6 py-4 bg-[#6b3541] text-white flex justify-between items-center shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[22px] text-[#ffd9de]">cake</span>
            </div>
            <div>
              <h3 className="font-bold text-[18px] tracking-tight">Interactive 3D Cake Studio</h3>
              <p className="text-[12px] text-[#ffd9de]/90">
                Design custom tiered bakes layer-by-layer • Rotate 3D view & customize details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] uppercase font-semibold text-[#ffd9de]">Required 50% Deposit</span>
              <span className="font-bold text-[16px] text-white">{depositPrice} ETB</span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-white/20"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Studio Grid: Left Canvas, Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* LEFT: 3D CANVAS VIEWPORT */}
          <div className="lg:col-span-6 bg-[#fbf5f2] p-5 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#d7c1c4]/50 min-h-[440px] overflow-hidden">
            
            {/* View Mode & Lighting Selector Toolbar */}
            <div className="flex items-center justify-between z-20 gap-2 mb-2">
              <div className="flex bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-[#d7c1c4]/60 shadow-xs">
                <button
                  onClick={() => {
                    playTactileFeedback(400);
                    setViewMode('3d');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-[#8b4b58] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#f8ebe6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">3d_rotation</span>
                  <span>Solid 3D</span>
                </button>
                <button
                  onClick={() => {
                    playTactileFeedback(450);
                    setViewMode('slice');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'slice'
                      ? 'bg-[#8b4b58] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#f8ebe6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                  <span>Slice View</span>
                </button>
                <button
                  onClick={() => {
                    playTactileFeedback(500);
                    setViewMode('top');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'top'
                      ? 'bg-[#8b4b58] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#f8ebe6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">north</span>
                  <span>Top Aerial</span>
                </button>
              </div>

              {/* Lighting & Spin Toggle */}
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1.5 bg-[#8b4b58] text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-xs">
                  <span>{activeOccasion.icon}</span>
                  <span>{activeOccasion.badge}</span>
                </div>

                <button
                  onClick={() => {
                    const modes: Array<'studio' | 'warm' | 'cool'> = ['studio', 'warm', 'cool'];
                    const next = modes[(modes.indexOf(lightingPreset) + 1) % modes.length];
                    setLightingPreset(next);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white text-[#8b4b58] font-bold text-[11px] border border-[#d7c1c4] shadow-xs flex items-center gap-1 cursor-pointer hover:bg-[#f8ebe6]"
                >
                  <span className="material-symbols-outlined text-[15px]">light_mode</span>
                  <span className="capitalize">{lightingPreset}</span>
                </button>

                <button
                  onClick={() => setIsAutoSpin(!isAutoSpin)}
                  title="Auto Rotate 360°"
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                    isAutoSpin
                      ? 'bg-[#8b4b58] text-white border-[#8b4b58] shadow-xs'
                      : 'bg-white text-[#524345] border-[#d7c1c4]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE 3D CANVAS */}
            <div
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative flex-1 flex flex-col items-center justify-center my-1 select-none overflow-hidden cursor-grab active:cursor-grabbing rounded-3xl"
            >
              {/* Studio Background Glow */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ${
                  lightingPreset === 'warm'
                    ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/60 via-rose-50/40 to-transparent'
                    : lightingPreset === 'cool'
                    ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-100/60 via-sky-50/40 to-transparent'
                    : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/70 via-[#f8ebe6]/40 to-transparent'
                }`}
              />

              {/* VIEW 1: 3D VOLUMETRIC SVG CANVAS */}
              {viewMode === '3d' && (
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-100"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <svg width="100%" height="355" viewBox="0 0 400 355" className="overflow-visible">
                    <defs>
                      <linearGradient id="pedestalFill" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={selectedPedestal.fill1} />
                        <stop offset="50%" stopColor={selectedPedestal.fill2} />
                        <stop offset="100%" stopColor={selectedPedestal.fill1} />
                      </linearGradient>
                    </defs>

                    {/* Pedestal Base Tray */}
                    <g transform="translate(0, 20)">
                      <ellipse cx="200" cy="285" rx="145" ry="30" fill="#000000" opacity="0.16" filter="blur(5px)" />
                      <path
                        d="M 65 270 A 135 26 0 0 0 335 270 L 335 282 A 135 26 0 0 1 65 282 Z"
                        fill="url(#pedestalFill)"
                        stroke={selectedPedestal.stroke}
                        strokeWidth="1"
                      />
                      <ellipse
                        cx="200"
                        cy="270"
                        rx="135"
                        ry="26"
                        fill="url(#pedestalFill)"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </g>

                    {/* RENDER TIERS FROM BOTTOM UPWARD */}
                    {/* Base Tier (Tiers == 3) */}
                    {tiers === 3 &&
                      renderCylinderTier(
                        200,
                        195,
                        120,
                        60,
                        baseColorOption,
                        `BASE: ${baseColorOption.name.split(' ')[0]}`,
                        'base'
                      )}

                    {/* Middle Tier (Tiers >= 2) */}
                    {tiers >= 2 &&
                      renderCylinderTier(
                        200,
                        tiers === 3 ? 135 : 180,
                        tiers === 3 ? 92 : 115,
                        tiers === 3 ? 60 : 65,
                        middleColorOption,
                        `MID: ${middleColorOption.name.split(' ')[0]}`,
                        'middle'
                      )}

                    {/* Top Tier */}
                    {renderCylinderTier(
                      200,
                      tiers === 3 ? 70 : tiers === 2 ? 125 : 180,
                      tiers === 3 ? 65 : tiers === 2 ? 88 : 115,
                      tiers === 3 ? 60 : tiers === 2 ? 65 : 70,
                      topColorOption,
                      `TOP: ${topColorOption.name.split(' ')[0]}`,
                      'top'
                    )}

                    {/* 3D Topper attached dynamically on top cap */}
                    {topperIcon && (
                      <g transform={`translate(200, ${topCapY - 8})`}>
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          fontSize="36"
                          style={{ filter: 'drop-shadow(0px 6px 8px rgba(0,0,0,0.25))' }}
                        >
                          {topperIcon}
                        </text>
                      </g>
                    )}

                    {/* Inscription Plaque Positioned Cleanly Below Cake & Pedestal Tray */}
                    {inscription && (
                      <g transform="translate(200, 332)">
                        <rect
                          x="-125"
                          y="-13"
                          width="250"
                          height="26"
                          rx="13"
                          fill={
                            plaqueBg === 'gold'
                              ? '#d4af37'
                              : plaqueBg === 'chocolate'
                              ? '#3e2418'
                              : '#ffffff'
                          }
                          stroke="#6b3541"
                          strokeWidth="2"
                          filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.15))"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill={plaqueBg === 'chocolate' || plaqueBg === 'gold' ? '#ffffff' : '#6b3541'}
                          fontSize="11"
                          fontWeight="bold"
                        >
                          "{inscription}"
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              )}

              {/* VIEW 2: INTERIOR SLICE VIEW */}
              {viewMode === 'slice' && (
                <div className="w-full max-w-sm bg-white p-5 rounded-3xl border border-[#d7c1c4] shadow-lg space-y-3 z-20 my-auto">
                  <div className="flex justify-between items-center border-b border-[#d7c1c4]/40 pb-2">
                    <span className="text-[12px] font-bold text-[#6b3541] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">restaurant</span>
                      Sponge Cutaway & Layer Breakdown
                    </span>
                    <span className="text-[10px] text-[#605e5a] font-semibold">150g Serving Slice</span>
                  </div>

                  <div className="space-y-2 py-1">
                    <div className="p-3 rounded-xl border border-[#d7c1c4]/60 space-y-1 bg-[#fdf8f6]">
                      <div className="flex justify-between items-center text-[11px] font-bold text-[#201a18]">
                        <span>Top Tier Sponge</span>
                        <span className="text-[#6b3541]">{topColorOption.name}</span>
                      </div>
                      <div className="h-3.5 rounded-full overflow-hidden flex shadow-inner border border-black/10">
                        <div className="w-3/5 h-full" style={{ backgroundColor: topColorOption.spongeColor }} />
                        <div className="w-2/5 h-full" style={{ backgroundColor: topColorOption.fillingColor }} />
                      </div>
                    </div>

                    {tiers >= 2 && (
                      <div className="p-3 rounded-xl border border-[#d7c1c4]/60 space-y-1 bg-[#fdf8f6]">
                        <div className="flex justify-between items-center text-[11px] font-bold text-[#201a18]">
                          <span>Middle Tier Sponge</span>
                          <span className="text-[#6b3541]">{middleColorOption.name}</span>
                        </div>
                        <div className="h-3.5 rounded-full overflow-hidden flex shadow-inner border border-black/10">
                          <div className="w-3/5 h-full" style={{ backgroundColor: middleColorOption.spongeColor }} />
                          <div className="w-2/5 h-full" style={{ backgroundColor: middleColorOption.fillingColor }} />
                        </div>
                      </div>
                    )}

                    {tiers >= 3 && (
                      <div className="p-3 rounded-xl border border-[#d7c1c4]/60 space-y-1 bg-[#fdf8f6]">
                        <div className="flex justify-between items-center text-[11px] font-bold text-[#201a18]">
                          <span>Base Tier Sponge</span>
                          <span className="text-[#6b3541]">{baseColorOption.name}</span>
                        </div>
                        <div className="h-3.5 rounded-full overflow-hidden flex shadow-inner border border-black/10">
                          <div className="w-3/5 h-full" style={{ backgroundColor: baseColorOption.spongeColor }} />
                          <div className="w-2/5 h-full" style={{ backgroundColor: baseColorOption.fillingColor }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 3: TOP AERIAL VIEW */}
              {viewMode === 'top' && (
                <div className="relative w-52 h-52 rounded-full border-4 border-[#6b3541] shadow-xl flex items-center justify-center p-3 bg-white z-20 my-auto">
                  <div
                    className="w-44 h-44 rounded-full border border-[#6b3541]/30 flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: baseColorOption.color }}
                  >
                    {tiers >= 2 && (
                      <div
                        className="w-32 h-32 rounded-full border border-white/80 flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: middleColorOption.color }}
                      >
                        <div
                          className="w-20 h-20 rounded-full border border-white flex items-center justify-center shadow-md text-xl"
                          style={{ backgroundColor: topColorOption.color }}
                        >
                          {topperIcon}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Orbit & Zoom Angle Toolbar */}
            {viewMode === '3d' && (
              <div className="space-y-2 z-20">
                {/* Floating Quick Tier Selector */}
                <div className="flex items-center justify-between bg-[#f8ebe6]/80 px-3 py-1.5 rounded-2xl border border-[#d7c1c4]">
                  <span className="text-[10px] font-bold text-[#6b3541] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">ads_click</span>
                    <span>Selected Tier:</span>
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedTierKey('top');
                        playTactileFeedback(620);
                        setActiveTab('layers');
                      }}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        selectedTierKey === 'top'
                          ? 'bg-[#6b3541] text-white shadow-xs'
                          : 'bg-white text-[#524345] border border-[#d7c1c4] hover:bg-[#f8ebe6]'
                      }`}
                    >
                      Top Tier
                    </button>
                    {tiers >= 2 && (
                      <button
                        onClick={() => {
                          setSelectedTierKey('middle');
                          playTactileFeedback(620);
                          setActiveTab('layers');
                        }}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          selectedTierKey === 'middle'
                            ? 'bg-[#6b3541] text-white shadow-xs'
                            : 'bg-white text-[#524345] border border-[#d7c1c4] hover:bg-[#f8ebe6]'
                        }`}
                      >
                        Middle Tier
                      </button>
                    )}
                    {tiers === 3 && (
                      <button
                        onClick={() => {
                          setSelectedTierKey('base');
                          playTactileFeedback(620);
                          setActiveTab('layers');
                        }}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          selectedTierKey === 'base'
                            ? 'bg-[#6b3541] text-white shadow-xs'
                            : 'bg-white text-[#524345] border border-[#d7c1c4] hover:bg-[#f8ebe6]'
                        }`}
                      >
                        Base Tier
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full bg-white px-3.5 py-2 rounded-2xl border border-[#d7c1c4]/60 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                  {/* Camera Angles Quick Buttons */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold text-[#605e5a] mr-0.5">Camera:</span>
                    {[
                      { label: 'Front', yaw: 0, tilt: 15, icon: 'crop_16_9' },
                      { label: '3/4 Studio', yaw: 35, tilt: 22, icon: '3d_rotation' },
                      { label: 'Table Level', yaw: 15, tilt: 8, icon: 'photo_camera' },
                      { label: 'Aerial', yaw: 0, tilt: 45, icon: 'north' },
                    ].map((cam) => (
                      <button
                        key={cam.label}
                        onClick={() => {
                          playTactileFeedback(550, 0.04);
                          setYawAngle(cam.yaw);
                          setTiltAngle(cam.tilt);
                        }}
                        className="px-2 py-1 rounded-lg bg-[#f8ebe6] hover:bg-[#8b4b58] hover:text-white border border-[#d7c1c4] text-[10px] font-bold text-[#524345] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[12px]">{cam.icon}</span>
                        <span>{cam.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Rotate Slider & Zoom */}
                  <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                    <span className="material-symbols-outlined text-[16px] text-[#6b3541]">rotate_right</span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={yawAngle}
                      onChange={(e) => setYawAngle(Number(e.target.value))}
                      className="w-full accent-[#6b3541] cursor-pointer"
                    />
                    <span className="text-[10px] font-mono font-bold text-[#6b3541] w-8">{Math.round(yawAngle)}°</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 border-l border-[#d7c1c4]/60 pl-2">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                      className="w-6 h-6 rounded-lg bg-[#f8ebe6] text-[#6b3541] font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-[#ede0db]"
                    >
                      -
                    </button>
                    <span className="text-[10px] font-bold text-[#524345] w-8 text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                      className="w-6 h-6 rounded-lg bg-[#f8ebe6] text-[#6b3541] font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-[#ede0db]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Price Footer */}
            <div className="w-full mt-2 bg-white p-3.5 rounded-2xl border border-[#d7c1c4] shadow-sm flex justify-between items-center z-20">
              <div>
                <span className="text-[10px] text-[#605e5a] font-bold block uppercase tracking-wider">
                  Total Custom Bake ({guests} Servings)
                </span>
                <span className="font-extrabold text-[22px] text-[#6b3541]">{totalPrice} ETB</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#605e5a] font-bold block uppercase tracking-wider">
                  50% Deposit Due
                </span>
                <span className="font-bold text-[14px] text-amber-800 bg-amber-50 px-3 py-0.5 rounded-xl border border-amber-200 inline-block">
                  {depositPrice} ETB
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: CUSTOMIZATION CONTROLS PANEL */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-white overflow-y-auto max-h-[720px]">
            <div className="space-y-5">
              
              {/* Studio Tabs */}
              <div className="flex bg-[#f8ebe6] p-1 rounded-2xl border border-[#d7c1c4]/60 gap-1 overflow-x-auto">
                <button
                  onClick={() => {
                    playTactileFeedback(330);
                    setActiveTab('event');
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'event'
                      ? 'bg-[#6b3541] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#ede0db]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">celebration</span>
                  <span>Event Theme</span>
                </button>

                <button
                  onClick={() => {
                    playTactileFeedback(350);
                    setActiveTab('layers');
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'layers'
                      ? 'bg-[#6b3541] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#ede0db]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">layers</span>
                  <span>1. Tiers</span>
                </button>

                <button
                  onClick={() => {
                    playTactileFeedback(370);
                    setActiveTab('decor');
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'decor'
                      ? 'bg-[#6b3541] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#ede0db]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">palette</span>
                  <span>2. Frosting</span>
                </button>

                <button
                  onClick={() => {
                    playTactileFeedback(380);
                    setActiveTab('stand');
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'stand'
                      ? 'bg-[#6b3541] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#ede0db]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">view_agenda</span>
                  <span>3. Stand</span>
                </button>

                <button
                  onClick={() => {
                    playTactileFeedback(390);
                    setActiveTab('inscription');
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'inscription'
                      ? 'bg-[#6b3541] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#ede0db]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">format_quote</span>
                  <span>4. Text</span>
                </button>

                <button
                  onClick={() => {
                    playTactileFeedback(410);
                    setActiveTab('preset');
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'preset'
                      ? 'bg-[#6b3541] text-white shadow-xs'
                      : 'text-[#605e5a] hover:bg-[#ede0db]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  <span>Presets</span>
                </button>
              </div>

              {/* Occasion Quick Bar Strip */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {EVENT_OCCASIONS.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => applyOccasionTheme(occ)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                      selectedOccasionId === occ.id
                        ? 'bg-[#6b3541] text-white border-[#6b3541] shadow-xs scale-[1.02]'
                        : 'bg-[#f8ebe6] text-[#524345] border-[#d7c1c4] hover:bg-[#ede0db]'
                    }`}
                  >
                    <span>{occ.icon}</span>
                    <span>{occ.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* TAB 0: EVENT THEME & CUSTOMIZATION */}
              {activeTab === 'event' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-[13px] font-extrabold text-[#201a18] flex items-center gap-1.5 mb-1">
                      <span>{activeOccasion.icon}</span>
                      <span>Select Celebration Occasion</span>
                    </h4>
                    <p className="text-[11px] text-[#605e5a]">
                      Pick your event to instantly tailor colors, toppers, frosting drip, and inscription message templates.
                    </p>
                  </div>

                  {/* Occasion Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {EVENT_OCCASIONS.map((occ) => {
                      const isSelected = selectedOccasionId === occ.id;
                      return (
                        <div
                          key={occ.id}
                          onClick={() => applyOccasionTheme(occ)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#f8ebe6] border-[#6b3541] ring-2 ring-[#6b3541]/20 shadow-xs'
                              : 'bg-white border-[#d7c1c4]/70 hover:border-[#6b3541]/50 hover:bg-[#fbf5f2]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[20px]">{occ.icon}</span>
                              <span className="font-extrabold text-[12px] text-[#201a18]">{occ.name}</span>
                            </div>
                            {isSelected && (
                              <span className="material-symbols-outlined text-[16px] text-[#6b3541]">
                                check_circle
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#605e5a] line-clamp-2 leading-relaxed">
                            {occ.description}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[9px] font-bold bg-[#6b3541]/10 text-[#6b3541] px-2 py-0.5 rounded-full">
                              {occ.badge}
                            </span>
                            <span className="text-[9px] text-[#847375]">
                              {occ.tiers} Tiers • Topper {occ.topper}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Event-Specific Detailed Inputs */}
                  <div className="p-4 bg-[#f8ebe6]/80 rounded-2xl border border-[#d7c1c4] space-y-3">
                    <h5 className="text-[11px] font-extrabold text-[#6b3541] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">tune</span>
                      <span>Occasion Specific Details ({activeOccasion.name})</span>
                    </h5>

                    {selectedOccasionId === 'graduation' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-[#524345] block mb-1">Graduation Year</label>
                            <input
                              type="text"
                              value={gradYear}
                              onChange={(e) => {
                                setGradYear(e.target.value);
                                setInscription(`Congratulations Class of ${e.target.value}!`);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#d7c1c4] rounded-xl text-[11px] font-bold text-[#201a18]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-[#524345] block mb-1">University / School</label>
                            <input
                              type="text"
                              value={gradSchool}
                              onChange={(e) => setGradSchool(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#d7c1c4] rounded-xl text-[11px] font-bold text-[#201a18]"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-[#605e5a]">
                          🎓 Plaque inscription updated to: <span className="font-bold text-[#6b3541]">"{inscription}"</span>
                        </p>
                      </div>
                    )}

                    {selectedOccasionId === 'wedding' && (
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] font-bold text-[#524345] block mb-1">Couple's Names</label>
                          <input
                            type="text"
                            value={coupleNames}
                            onChange={(e) => {
                              setCoupleNames(e.target.value);
                              setInscription(`${e.target.value} | Forever & Always`);
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#d7c1c4] rounded-xl text-[11px] font-bold text-[#201a18]"
                            placeholder="e.g. Beni & Henok"
                          />
                        </div>
                        <p className="text-[10px] text-[#605e5a]">
                          💍 Plaque inscription updated to: <span className="font-bold text-[#6b3541]">"{inscription}"</span>
                        </p>
                      </div>
                    )}

                    {selectedOccasionId === 'birthday' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-[#524345] block mb-1">Celebrant Name</label>
                            <input
                              type="text"
                              value={birthdayName}
                              onChange={(e) => {
                                setBirthdayName(e.target.value);
                                setInscription(`Happy ${birthdayAge}th Birthday ${e.target.value}!`);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#d7c1c4] rounded-xl text-[11px] font-bold text-[#201a18]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-[#524345] block mb-1">Turning Age</label>
                            <input
                              type="text"
                              value={birthdayAge}
                              onChange={(e) => {
                                setBirthdayAge(e.target.value);
                                setInscription(`Happy ${e.target.value}th Birthday ${birthdayName}!`);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#d7c1c4] rounded-xl text-[11px] font-bold text-[#201a18]"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-[#605e5a]">
                          🎂 Plaque inscription updated to: <span className="font-bold text-[#6b3541]">"{inscription}"</span>
                        </p>
                      </div>
                    )}

                    {selectedOccasionId !== 'graduation' && selectedOccasionId !== 'wedding' && selectedOccasionId !== 'birthday' && (
                      <div>
                        <label className="text-[10px] font-bold text-[#524345] block mb-1">Plaque Inscription</label>
                        <input
                          type="text"
                          value={inscription}
                          onChange={(e) => setInscription(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#d7c1c4] rounded-xl text-[11px] font-bold text-[#201a18]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1: TIERS & COLOR SWATCHES */}
              {activeTab === 'layers' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[12px] font-bold text-[#524345]">Number of Cake Tiers</label>
                      <span className="text-[11px] font-bold text-[#6b3541]">{tiers} Tiers (Base 700 ETB/tier)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            playTactileFeedback(400 + t * 50);
                            setTiers(t);
                          }}
                          className={`py-3 rounded-2xl font-bold text-[13px] border transition-all cursor-pointer flex flex-col items-center justify-center ${
                            tiers === t
                              ? 'bg-[#6b3541] text-white border-[#6b3541] shadow-sm scale-[1.02]'
                              : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4] hover:bg-[#ede0db]'
                          }`}
                        >
                          <span>{t} {t === 1 ? 'Tier' : 'Tiers'}</span>
                          <span className="text-[10px] opacity-80 font-normal">
                            {t === 1 ? '15-20 Guests' : t === 2 ? '25-40 Guests' : '50-100 Guests'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Top Tier Color Swatches */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#524345]">Top Tier Color Swatch</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            playTactileFeedback(500);
                            setTopColorOption(c);
                          }}
                          title={c.name}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            topColorOption.id === c.id
                              ? 'ring-2 ring-[#6b3541] border-[#6b3541] bg-[#f8ebe6]'
                              : 'border-[#d7c1c4] bg-white hover:bg-gray-50'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: c.color }} />
                          <span className="text-[9px] font-bold text-center line-clamp-1">{c.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Middle Tier Color Swatches (if >= 2) */}
                  {tiers >= 2 && (
                    <div className="space-y-2 pt-1 border-t border-[#d7c1c4]/40">
                      <label className="text-[12px] font-bold text-[#524345]">Middle Tier Color Swatch</label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              playTactileFeedback(520);
                              setMiddleColorOption(c);
                            }}
                            title={c.name}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              middleColorOption.id === c.id
                                ? 'ring-2 ring-[#6b3541] border-[#6b3541] bg-[#f8ebe6]'
                                : 'border-[#d7c1c4] bg-white hover:bg-gray-50'
                            }`}
                          >
                            <span className="w-6 h-6 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: c.color }} />
                            <span className="text-[9px] font-bold text-center line-clamp-1">{c.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Base Tier Color Swatches (if == 3) */}
                  {tiers >= 3 && (
                    <div className="space-y-2 pt-1 border-t border-[#d7c1c4]/40">
                      <label className="text-[12px] font-bold text-[#524345]">Base Tier Color Swatch</label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              playTactileFeedback(540);
                              setBaseColorOption(c);
                            }}
                            title={c.name}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              baseColorOption.id === c.id
                                ? 'ring-2 ring-[#6b3541] border-[#6b3541] bg-[#f8ebe6]'
                                : 'border-[#d7c1c4] bg-white hover:bg-gray-50'
                            }`}
                          >
                            <span className="w-6 h-6 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: c.color }} />
                            <span className="text-[9px] font-bold text-center line-clamp-1">{c.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-[#f8ebe6] rounded-2xl border border-[#d7c1c4] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-[#524345]">Serving Headcount</span>
                      <span className="text-[13px] font-bold text-[#6b3541]">{guests} Guests ({guests * 150}g)</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full accent-[#6b3541] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: FROSTING FINISH & DRIP & ACCENTS */}
              {activeTab === 'decor' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-2">Outer Frosting Texture</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FINISHES.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            playTactileFeedback(480);
                            setFinish(f);
                          }}
                          className={`p-2.5 rounded-xl text-[12px] font-bold border text-left transition-all cursor-pointer ${
                            finish === f
                              ? 'bg-[#6b3541] text-white border-[#6b3541] shadow-xs'
                              : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4] hover:bg-[#ede0db]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-2">Rim Drip Accent (+250 ETB)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {DRIPS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            playTactileFeedback(500);
                            setDrip(d);
                          }}
                          className={`p-2.5 rounded-xl text-[12px] font-bold border text-left transition-all cursor-pointer ${
                            drip === d
                              ? 'bg-[#6b3541] text-white border-[#6b3541] shadow-xs'
                              : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4] hover:bg-[#ede0db]'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-2">Topper Accent</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TOPPERS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            playTactileFeedback(520);
                            setTopperIcon(t.icon);
                          }}
                          className={`p-2 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            topperIcon === t.icon
                              ? 'bg-[#6b3541] text-white border-[#6b3541] shadow-xs'
                              : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4] hover:bg-[#ede0db]'
                          }`}
                        >
                          <span>{t.icon || '🚫'}</span>
                          <span className="line-clamp-1">{t.label.replace(/^.\s*/, '')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-2">Surface Accents (Max 3)</label>
                    <div className="flex flex-wrap gap-2">
                      {ACCENTS.map((acc) => {
                        const isSelected = selectedAccents.includes(acc);
                        return (
                          <button
                            key={acc}
                            type="button"
                            onClick={() => toggleAccent(acc)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#6b3541] text-white border-[#6b3541]'
                                : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4] hover:bg-[#ede0db]'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '} {acc}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STAND & PIPING */}
              {activeTab === 'stand' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-2">Pedestal Base Stand</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PEDESTAL_STYLES.map((ps) => (
                        <button
                          key={ps.id}
                          type="button"
                          onClick={() => {
                            playTactileFeedback(460);
                            setPedestalStyle(ps.id);
                          }}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            pedestalStyle === ps.id
                              ? 'bg-[#6b3541] text-white border-[#6b3541] shadow-xs'
                              : 'bg-[#f8ebe6] text-[#201a18] border-[#d7c1c4] hover:bg-[#ede0db]'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: ps.fill1 }}
                          />
                          <span className="text-[12px] font-bold">{ps.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-2">Border Piping Trim</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PIPING_STYLES.map((ps) => (
                        <button
                          key={ps}
                          type="button"
                          onClick={() => {
                            playTactileFeedback(470);
                            setPipingStyle(ps);
                          }}
                          className={`p-3 rounded-xl text-[12px] font-bold border text-left transition-all cursor-pointer ${
                            pipingStyle === ps
                              ? 'bg-[#6b3541] text-white border-[#6b3541] shadow-xs'
                              : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4] hover:bg-[#ede0db]'
                          }`}
                        >
                          {ps}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INSCRIPTION TEXT */}
              {activeTab === 'inscription' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#524345]">Plaque Inscription Message</label>
                    <input
                      type="text"
                      maxLength={40}
                      value={inscription}
                      onChange={(e) => setInscription(e.target.value)}
                      placeholder="e.g. Happy Birthday Sarah!"
                      className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-bold text-[#201a18] outline-none focus:border-[#6b3541]"
                    />
                    <span className="text-[10px] text-[#605e5a]">{inscription.length}/40 characters</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#524345]">Plaque Material Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'fondant', label: 'White Fondant' },
                        { id: 'gold', label: 'Edible Gold' },
                        { id: 'chocolate', label: 'Dark Chocolate' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPlaqueBg(p.id as any)}
                          className={`py-2 rounded-xl text-[11px] font-bold border cursor-pointer ${
                            plaqueBg === p.id
                              ? 'bg-[#6b3541] text-white border-[#6b3541]'
                              : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4]'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PRESETS */}
              {activeTab === 'preset' && (
                <div className="space-y-3 animate-fade-in">
                  <label className="text-[12px] font-bold text-[#524345] block">Quick Studio Presets</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="p-3.5 bg-[#f8ebe6] hover:bg-[#ede0db] border border-[#d7c1c4] rounded-2xl text-left transition-all cursor-pointer group space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[13px] text-[#201a18] group-hover:text-[#6b3541]">
                            {p.name}
                          </span>
                          <span className="text-lg">{p.topper}</span>
                        </div>
                        <p className="text-[11px] text-[#605e5a]">
                          {p.tiers} Tiers • {p.topColor.name} & {p.baseColor.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#d7c1c4]/50 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-[#f8ebe6] hover:bg-[#ede0db] text-[#524345] font-bold text-[13px] transition-all cursor-pointer border border-[#d7c1c4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishCustomBuild}
                className="flex-[2] py-3 px-4 rounded-xl bg-[#6b3541] hover:bg-[#572934] active:scale-98 text-white font-bold text-[13px] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Add Custom Bake to Cart ({depositPrice} ETB Deposit)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
