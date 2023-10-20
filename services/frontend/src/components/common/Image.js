import File from "./File";

export default function Image(props) {
  return (<File {...props} acceptTypes="image/png, image/gif, image/jpeg"></File>)
}