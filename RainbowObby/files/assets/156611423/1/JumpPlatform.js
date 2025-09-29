/*JumpPlatform script that creates jump platform for the ball by Emre Şahin - emolingo games */
var JumpPlatform = pc.createScript('jumpPlatform');
JumpPlatform.attributes.add('direction', { type: 'vec3', default: [0, 150, 0] });
// initialize code called once per entity
JumpPlatform.prototype.initialize = function () {
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
};

JumpPlatform.prototype.onCollisionStart = function (result) {
    if (result.other.rigidbody) {
        result.other.rigidbody.applyImpulse(this.direction);
        const playerController = result.other.parent.script.playerController;
        playerController.playerModel.sound.play("jump");
        this.entity
            .tween(this.entity.getLocalScale()).to(new pc.Vec3(150, 150, 150), 0.1, pc.SineIn)
            .repeat(2)
            .yoyo(true)
            .start();
    }
};