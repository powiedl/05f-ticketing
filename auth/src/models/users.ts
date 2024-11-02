import mongoose, { mongo } from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  // hier erhält man Zugriff auf das Dokument mit this
  // Man muss daher function verwenden - und keine arrow function, weil bei der arrow function würde this überschrieben werden!
  // der Parameter done ist ein Callback, den man selbst am Ende der Funktion aufrufen muss - weil mongoose await und async eigentlich nicht unterstuetzt
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  const user = new User({
    email: attrs.email,
    password: attrs.password,
  });
  return user;
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const user1 = User.build({
  email: 'a@a.com',
  password: '17',
});

// Hier gäbe es Fehler
//const user2 = User.build({
//  emailaddr: 'b@b.com',
//  pass: 18,
//});

export { User, UserModel };
