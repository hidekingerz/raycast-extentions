import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useTwitter } from "./hooks/useTwitter";
import { getErrorMessage } from "./utils";
import { FormValues } from "./lib/types/tweetContents";

export default function Command() {
  const { createTweetContent, validTweet, sendTweet } = useTwitter();

  const defaultFormValues: FormValues = {
    body: "読んだ：",
    url: "https://",
    tag: ["#webclip"],
  };

  const handleSubmit = async (values: FormValues) => {
    const tweet = createTweetContent(values);
    try {
      if (!validTweet(tweet)) {
        await showToast({ style: Toast.Style.Failure, title: "Invalid Tweet", message: "Tweets are not valid" });
        return;
      }
      await sendTweet(tweet.text);
      await showToast({ title: "Tweet success!", message: "See X" });
    } catch (error) {
      await showToast({ style: Toast.Style.Failure, title: "Error", message: getErrorMessage(error) });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="保管したいWeb記事をClip" />
      <Form.TextField id="body" title={"Body"} placeholder={"Enter body"} defaultValue={defaultFormValues.body} />
      <Form.TextField id="url" title="URL" placeholder="Enter URL" defaultValue={defaultFormValues.url} />
      <Form.Separator />
      <Form.TagPicker id="tag" title="Tag" defaultValue={defaultFormValues.tag}>
        <Form.TagPicker.Item value="#webclip" title="#webclip" />
      </Form.TagPicker>
    </Form>
  );
}