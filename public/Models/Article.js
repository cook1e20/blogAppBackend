const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');


const ArticleSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: String,
  description: String,
  body: String,
  tagList: [{ type: String }],
  favoritesCount: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken.' });

ArticleSchema.methods.slugify = function () {
  this.slug = `${slug(this.title)}-${(Math.random() * (36 ** 6)).toString(36)}`;
};

ArticleSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }
  return next();
});

ArticleSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    favoritesCount: this.favoritesCount,
    favorited: user ? user.usFavirote(this.id) : false,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.toProfileJSONFor(user),
  };
};

mongoose.model('Article', ArticleSchema);
