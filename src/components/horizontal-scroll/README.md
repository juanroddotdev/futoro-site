# Horizontal Scroll Components

A collection of Vue components for creating horizontal scrolling sections that respond to vertical page scrolling.

## Components

### Core Components

- **HorizontalScrollContainer**: The main container that tracks scroll position and provides context to child components.
- **ScrollTracker**: A utility component for tracking element position relative to the viewport.

### UI Components

- **ScrollRow**: A horizontal row of items that can scroll in either direction.
- **ScrollItem**: An individual item within a scroll row.
- **StrugglesOffersSection**: A complete example implementation showing struggles and solutions.

## Usage

### Basic Usage

```vue
<HorizontalScrollContainer>
  <ScrollRow title="My Horizontal Row">
    <ScrollItem type="title">
      <h3>Title Card</h3>
    </ScrollItem>
    
    <ScrollItem v-for="item in items" :key="item.id" type="content">
      <h4>{{ item.title }}</h4>
      <p>{{ item.description }}</p>
    </ScrollItem>
  </ScrollRow>
</HorizontalScrollContainer>
```

### Reverse Direction

```vue
<ScrollRow 
  title="Reverse Row" 
  direction="reverse"
  :slideInReverse="true"
>
  <!-- Content here -->
</ScrollRow>
```

## Props

### HorizontalScrollContainer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| height | String | 'auto' | Height of the container ('auto' or specific value) |
| debug | Boolean | false | Show debug overlay with scroll information |

### ScrollRow

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| direction | String | 'normal' | Direction of scroll ('normal' or 'reverse') |
| title | String | '' | Title for the row |
| slideInReverse | Boolean | false | Enable slide-in animation for reverse direction |
| entranceThreshold | Number | 0.2 | Threshold for entrance animation (0-1) |

### ScrollItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | String | 'content' | Type of item ('title' or 'content') |