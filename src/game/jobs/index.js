import TempJob from './temp';
import HealerJob from './healer';
import MeleeJob from './melee';
import CasterJob from './caster';
import HunterJob from './hunter';
import KnightJob from './knight';

const jobMap = {
    'TMP': TempJob,
    'HEAL': HealerJob,
    'MELEE': MeleeJob,
    'SPELL': CasterJob,
    'HUNTER': HunterJob,
    'KNIGHT': KnightJob,
}

export default jobMap;
