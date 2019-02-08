const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Mutations = {
    async createItem(parent, args, ctx, info) {
        //Todo: check if login
        const item = await ctx.db.mutation.createItem({
            data: { ...args }
        }, info);
        return item;
    },
    updateItem(parent, args, ctx, info) {
        const updates = { ...args };
        delete updates.id;
        //run the update
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        },
            info
        )
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        //1. find the item
        const item = await ctx.db.query.item({ where }, `{id title}`)
        //2. check if they own that item, or have the permission
        //TODO
        //3. Execute delete
        return ctx.db.mutation.deleteItem({ where }, info)
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        // hash password
        const password = await bcrypt.hash(args.password, 10);
        // create user in db
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        },
            info
        );
        //create JWT Token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
        //set the jwt on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 //1 hour
        });
        //return the user
        return user;
    }
};

module.exports = Mutations;
