---
layout: default
title: Forms
permalink: /forms/
---

<form>
  <div class="field">
    <label class="label">Name</label>
    <div class="control">
      <input class="input" type="text" placeholder="Text input" />
    </div>
  </div>

  <div class="field">
    <label class="label">Username</label>
    <div class="control">
      <input class="input is-success" type="text" placeholder="Text input" value="bulma" />
    </div>
    <p class="help is-success">This username is available.</p>
  </div>

  <div class="field">
    <label class="label">Email</label>
    <div class="control">
      <input class="input is-danger" type="email" placeholder="Email input" value="hello@" />
    </div>
    <p class="help is-danger">This email is invalid.</p>
  </div>

  <div class="field">
    <label class="label">Subject</label>
    <div class="control">
      <div class="select">
        <select>
          <option>Select dropdown</option>
          <option>With options</option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Tags</label>
    <div class="control">
      <div class="tags">
        <span class="tag is-link">Link</span>
        <span class="tag is-info">Info</span>
        <span class="tag is-success">Success</span>
        <span class="tag is-warning">Warning</span>
        <span class="tag is-danger">Danger</span>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Message</label>
    <div class="control">
      <textarea class="textarea" placeholder="Textarea"></textarea>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" />
        I agree to the <a href="#">terms and conditions</a>
      </label>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="radio">
        <input type="radio" name="question" />
        Yes
      </label>
      <label class="radio">
        <input type="radio" name="question" />
        No
      </label>
    </div>
  </div>

  <div class="field is-grouped">
    <div class="control">
      <button class="button is-link" type="button">Submit</button>
    </div>
    <div class="control">
      <button class="button is-link is-light" type="button">Cancel</button>
    </div>
  </div>
</form>

### Horizontal rule

<hr />
