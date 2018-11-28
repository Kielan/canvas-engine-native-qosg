const startScreen = {
  enter:function enter(){console.log("Entered start screen.")},
  exit:function exit(){console.log("Exited start screen.")},
  render:function render(display){
    display.drawText(1,1,"%c{yellow}Javasc Roguelike");
    display.drawText(1,2,"Press [Enter] to start!");
  }
};
export { startScreen }
