import TempJob from './temp';
import HealerJob from './healer';
import MeleeJob from './melee';
import CasterJob from './caster';
import HunterJob from './hunter';

const jobMap = {
    'TMP': TempJob,
    'HEAL': HealerJob,
    'MELEE': MeleeJob,
    'SPELL': CasterJob,
    'HUNTER': HunterJob,
}

export default jobMap;
