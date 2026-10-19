import ScientificScene from '@/components/science/scientific-scene';
export default function LabScene({ variant = 'bench' }: { variant?: 'bench' | 'glass' }) {
  return <div className={`lab-scene lab-scene-${variant}`}><ScientificScene variant={variant === 'bench' ? 'molecule' : 'cell'}/></div>;
}
