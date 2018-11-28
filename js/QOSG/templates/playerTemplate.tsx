import { EntityMixins } from '../mixins'

export const PlayerTemplate={
  name:"human (you)",
  character:"@",foreground:"white",maxHp:40,
  attackValue:10,sightRadius:11,inventorySlots:22,
  mixins:[
    EntityMixins.PlayerActor,
    EntityMixins.Sight
  ]
};
