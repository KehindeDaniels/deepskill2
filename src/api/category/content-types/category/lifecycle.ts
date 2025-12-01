// module.exports = {
//   beforeCreate(event) {
//     const { data } = event.params;
//     // For example, auto-generate slug from title if not provided
//     if (!data.slug && data.title) {
//       data.slug = slugify(data.title);
//     }
//   },
//   afterCreate(event) {
//     const { result, params } = event;
//     console.log("New post created with id:", result.id);
//     // maybe call external service, send email, etc.
//   },
//   beforeUpdate(event) {
//     // custom logic before update
//   },
//   afterDelete(event) {
//     // cleanup logic after delete
//   },
//   // and others as required
// };
